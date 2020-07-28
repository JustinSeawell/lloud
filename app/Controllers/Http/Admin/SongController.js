"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const moment = require("moment");

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
  async index({ params, view }) {
    const page = params.page || 1;

    const songs = await Song.query()
      .with("audioFile")
      .with("imageFile")
      .orderBy("created_at", "desc")
      .paginate(page);

    return view.render("admin.songs.index", { songs });
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
  async show({ params, request, response, view }) {
    const song = await Song.query()
      .where("id", params.id)
      .with("audioFile")
      .with("imageFile")
      .with("artists")
      .with("genre")
      .first();

    const artist = song.getRelated("artists").rows[0];

    let displayTime;
    if (song.approved_at) {
      displayTime = moment(song.approved_at).fromNow();
    } else if (song.rejected_at) {
      displayTime = moment(song.rejected_at).fromNow();
    }

    return view.render("admin.songs.show", { song, artist, displayTime });
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
  async update({ params, request, response }) {
    const req = request.only(["result"]);

    try {
      const song = await Song.findOrFail(parseInt(params.id));

      const nowStr = moment().format("YYYY-MM-DD HH:mm:ss");
      if (req.result == "approve") {
        song.approved_at = nowStr;
      } else if (req.result == "deny") {
        song.rejected_at = nowStr;
      }

      await song.save();

      // TODO: setup new emails
      // if (req.result == "approve") {
      //   Event.fire("artist_application::denied", application.toJSON());
      // } else if (req.result == "deny") {
      //   Event.fire("artist_application::denied", application.toJSON());
      // }
    } catch (err) {
      console.log(err);
    }

    // TODO: Add flash msg
    return response.route("admin.songs");
  }

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
