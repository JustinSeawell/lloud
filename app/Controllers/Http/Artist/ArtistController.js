"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate } = use("Validator");
const Artist = use("App/Models/Artist");

/**
 * Resourceful controller for interacting with artists
 */
class ArtistController {
  /**
   * Show a list of all artists.
   * GET artists
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new artist.
   * GET artists/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new artist.
   * POST artists
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single artist.
   * GET artists/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ auth, request, response, view }) {
    const user = await auth.authenticator("session").getUser();
    const acct = await user.account().first();
    const artist = await Artist.findBy("account_id", acct.id);

    return view.render("artist.artists.show", { artist });
  }

  /**
   * Render a form to update an existing artist.
   * GET artists/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ auth, request, response, view }) {
    const user = await auth.authenticator("session").getUser();
    const acct = await user.account().first();
    const artist = await Artist.findBy("account_id", acct.id);

    return view.render("artist.artists.edit", { artist });
  }

  /**
   * Update artist details.
   * PUT or PATCH artists/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, session }) {
    const artist = await Artist.findOrFail(params.id);

    const rules = {
      name: "required",
      description: "required",
      city: "required",
      state: "required",
      zipcode: "required",
      country: "required",
    };

    const { name } = request.only(["name"]);

    if (name != artist.name) {
      rules.name = "required|unique:artists";
    }

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }

    const artistData = request.only([
      "name",
      "description",
      "city",
      "state",
      "zipcode",
      "country",
    ]);

    artist.merge(artistData);

    await artist.save();

    session.flash({ notification: "Artist profile updated!" });
    return response.route("artist.show");
  }

  /**
   * Delete a artist with id.
   * DELETE artists/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = ArtistController;
