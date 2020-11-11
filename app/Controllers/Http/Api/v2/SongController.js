"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Song = use("App/Models/Song");

/**
 * Resourceful controller for interacting with songs
 */
class SongController {
  /**
   * Show a list of all songs.
   * GET songs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    const page = request.input("page") || 1;

    const songs = await Song.query()
      .with("audioFile")
      .with("imageFile")
      .with("artists")
      .withCount("likes")
      .withCount("likes as liked_by_user", (builder) => {
        builder.where("user_id", auth.user.id);
      })
      .withCount("plays")
      .whereNull("deleted_at")
      .whereNotNull("approved_at")
      .orderBy("approved_at", "desc")
      .forPage(page, 10)
      .fetch();

    return response.ok({
      status: "success",
      data: { songs },
    });
  }

  /**
   * Render a form to be used for creating a new song.
   * GET songs/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new song.
   * POST songs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single song.
   * GET songs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params,  response, auth }) {
    const song = await Song.query()
      .with("audioFile")
      .with("imageFile")
      .with("artists")
      .withCount("likes")
      .withCount("likes as liked_by_user", (builder) => {
        builder.where("user_id", auth.user.id);
      })
      .withCount("plays")
      .where('id', params.id)
      .first();

    return response.ok({
      status: "success",
      data: { song },
    });
  }

  /**
   * Render a form to update an existing song.
   * GET songs/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update song details.
   * PUT or PATCH songs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a song with id.
   * DELETE songs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = SongController;
