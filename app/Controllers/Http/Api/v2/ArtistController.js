"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Artist = use("App/Models/Artist");
const Like = use("App/Models/Like");
const Play = use("App/Models/Play");

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
  async show({ params, request, response }) {

    const artist = await Artist.query().where('id', params.id).setHidden(['email', 'account_id', 'zipcode']).first();
    
    const songIds = await artist.getSongIds();

    const likes = await Like.query()
      .whereIn("song_id", songIds)
      .getCount();

    const plays = await Play.query()
      .whereIn("song_id", songIds)
      .getCount();

    return response.ok({
      status: "success",
      data: { artist, likes, plays },
    });
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
  async edit({ params, request, response, view }) {}

  /**
   * Update artist details.
   * PUT or PATCH artists/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

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
