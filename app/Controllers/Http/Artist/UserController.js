"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate } = use("Validator");
const User = use("App/Models/User");
const Artist = use("App/Models/Artist");
const ArtistRegistration = use("App/Services/ArtistRegistration");

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Render a form to be used for creating a new user.
   * GET users/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, session, auth }) {
    const rules = {
      artist_name: "required|unique:artists,name",
      email: "required|email",
      password: "required",
    };

    const validation = await validate(request.all(), rules);

    const sessAuth = auth.authenticator("session");

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }

    const userData = request.all();
    const { artist_name, email, password } = userData;

    const existingUser = await User.findBy("email", email);
    if (!existingUser) {
      try {
        await ArtistRegistration.registerArtist(userData);
      } catch (e) {
        console.log(e.message);
        session.flash({ errorMessage: "User registration failed" });
        return response.redirect("back");
      }

      // Login
      try {
        await sessAuth.attempt(email, password);
      } catch (e) {
        console.log(e.message);
        session.flash({ errorMessage: "User authentication failed" });
        return response.redirect("back");
      }

      return response.route("artist.home");
    }

    // User already exists
    try {
      await sessAuth.attempt(email, password);
    } catch (e) {
      console.log(e.message);
      session.flash({
        errorMessage: "User already exists. Incorrect password provided.",
      });
      return response.redirect("back");
    }

    const acct = await existingUser.account().first();

    if (acct.account_type_id == 1) {
      session.flash({
        errorMessage: "Admin users cannot use the artist portal",
      });
      return response.redirect("back");
    }

    if (acct.account_type_id == 3) {
      return response.route("artist.home");
    }

    acct.account_type_id = 3;
    acct.save();

    const artist = await Artist.create({
      name: artist_name,
      email: email,
      account_id: acct.id,
    });

    return response.route("artist.home");
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing user.
   * GET users/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}

  async logout({ auth, response }) {
    await auth.authenticator("session").logout();

    return response.route("artist.home");
  }

  async login({ auth, response, view }) {
    return view.render("artist.users.login");
  }

  async authenticate({ auth, request, response, session }) {
    const rules = {
      email: "required|email",
      password: "required",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }

    const { email, password } = request.all();

    try {
      await auth.authenticator("session").attempt(email, password);
    } catch (e) {
      session.flash({ errorMessage: "User authentication failed" });
      return response.redirect("back");
    }

    const user = await auth.authenticator("session").getUser();
    const acct = await user.account().first();

    if (acct.account_type_id !== 3) {
      const artist = await Artist.findBy("account_id", acct.id);
      if (!artist) {
        await auth.authenticator("session").logout();
        session.flash({
          errorMessage:
            "You must sign up as an artist before you can login to the artist portal.",
        });
        return response.redirect("back");
      }

      acct.account_type_id = 3;
      acct.save();
    }

    return response.route("artist.home");
  }
}

module.exports = UserController;
