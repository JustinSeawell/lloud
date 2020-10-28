'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Artist = use("App/Models/Artist");

/**
 * Resourceful controller for interacting with artistsongs
 */
class ArtistSongController {
  /**
   * Show a list of all artistsongs.
   * GET artistsongs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ params, response, auth }) {
    const artist = await Artist.find(params.artist_id);
    if (!artist) {
      return response.notFound({
        status: "fail",
        data: "Artist not found",
      });
    }

    const songs = await artist.songs()
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
      .fetch();

    return response.ok({
      status: "success",
      data: { songs: songs },
    });
  }

  /**
   * Render a form to be used for creating a new artistsong.
   * GET artistsongs/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new artistsong.
   * POST artistsongs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single artistsong.
   * GET artistsongs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing artistsong.
   * GET artistsongs/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update artistsong details.
   * PUT or PATCH artistsongs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a artistsong with id.
   * DELETE artistsongs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ArtistSongController
