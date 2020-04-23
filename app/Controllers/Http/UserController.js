"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/framework/src/Event')} Event */

const UserRegistration = use("App/Services/UserRegistration");

const { validate } = use("Validator");
const User = use("App/Models/User");

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, event }) {
    const rules = {
      username: "required|unique:users",
      email: "required|email|unique:users",
      password: "required",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return validation.messages();
    }
    const userData = request.only(["username", "email", "password"]);

    try {
      const user = await UserRegistration.registerListenerDefaultAccount(
        userData
      );

      return response.created({ success: true, message: user });
    } catch (err) {
      return {
        success: false,
        message: "User registration failed.",
      };
    }
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
  async show({ params, request, response, view }) {
    return await User.findByOrFail("id", params.id);
  }

  async login({ auth, request }) {
    const { email, password } = request.all();
    const output = await auth.attempt(email, password);

    return output;
  }

  async adminLogin({ auth, request, response }) {
    const { email, password } = request.all();
    await auth.authenticator("session").attempt(email, password);

    return response.route("ArtistApplicationController.index");
  }

  async me({ auth, request }) {
    try {
      return await auth.getUser();
    } catch (error) {
      response.send("Missing or invalid jwt token");
    }
  }
}

module.exports = UserController;
