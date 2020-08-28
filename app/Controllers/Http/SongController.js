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
  async index({ auth, response, params }) {
    const page = params.page || 1;

    const results = await Song.query()
      .with("audioFile")
      .with("imageFile")
      .with("artists")
      .with("likes")
      .with("plays")
      .whereNull("deleted_at")
      .whereNotNull("approved_at")
      .orderBy("approved_at", "desc")
      .paginate(page);

    /**
     * TODO:
     * - Refactor this to pull likesCount
     * directly from query
     */
    results.rows = results.rows.map((song) => {
      const likes = song.toJSON().likes;
      song.likesCount = likes.length;

      const plays = song.toJSON().plays;
      song.playsCount = plays.length;

      let userLikedThisSong = false;
      likes.forEach((like) => {
        if (like.user_id == auth.user.id) {
          userLikedThisSong = true;
        }
      });

      song.likedByUser = userLikedThisSong;

      return song;
    });

    response.send(results);
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
  async show({ params, request, response, view }) {}

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
