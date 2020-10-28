'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use("Database");
const Artist = use("App/Models/Artist");
const User = use("App/Models/User");

/**
 * Resourceful controller for interacting with artistsupporters
 */
class ArtistSupporterController {
  /**
   * Show a list of all artistsupporters.
   * GET artistsupporters
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

    const songIds = await artist.getSongIds();

    const topUserIds = await Database.pluck('user_id').from('likes').whereIn("song_id", songIds).sum('points_earned as points').groupBy("user_id").orderByRaw('points DESC').limit(5);

    const supporters = await User.query().with("profileImg").whereIn("id", topUserIds).setHidden(['email', 'address1', 'address2', 'city', 'state', 'zipcode', 'country', 'resetPasswordToken', 'resetPasswordExpires']).fetch();

    return response.ok({
      status: "success",
      data: { supporters },
    });
  }

  /**
   * Render a form to be used for creating a new artistsupporter.
   * GET artistsupporters/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new artistsupporter.
   * POST artistsupporters
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single artistsupporter.
   * GET artistsupporters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing artistsupporter.
   * GET artistsupporters/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update artistsupporter details.
   * PUT or PATCH artistsupporters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a artistsupporter with id.
   * DELETE artistsupporters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ArtistSupporterController
