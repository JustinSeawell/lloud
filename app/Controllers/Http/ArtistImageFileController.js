'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Artist = use("App/Models/Artist");

/**
 * Resourceful controller for interacting with artistimagefiles
 */
class ArtistImageFileController {
  /**
   * Show a list of all artistimagefiles.
   * GET artistimagefiles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ params, response }) {
    const artist = await Artist.find(params.artist_id);
    if (!artist) {
      return response.notFound({
        status: "fail",
        data: "Artist not found",
      });
    }

    // TODO: Change this to actual profile image
    const song = await artist.songs().with("imageFile").first();
    const imageFile = song.getRelated("imageFile");

    return response.ok({
      status: "success",
      data: {
        imageFile,
      },
    });
  }

  /**
   * Render a form to be used for creating a new artistimagefile.
   * GET artistimagefiles/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new artistimagefile.
   * POST artistimagefiles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single artistimagefile.
   * GET artistimagefiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing artistimagefile.
   * GET artistimagefiles/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update artistimagefile details.
   * PUT or PATCH artistimagefiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a artistimagefile with id.
   * DELETE artistimagefiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ArtistImageFileController
