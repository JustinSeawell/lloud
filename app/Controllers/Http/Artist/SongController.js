"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Artist = use("App/Models/Artist");
const ArtistSong = use("App/Models/ArtistSong");
const Genre = use("App/Models/Genre");
const Song = use("App/Models/Song");
const { validate } = use("Validator");

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
  async index({ request, response, view, auth }) {
    const acct = await auth.authenticator("session").user.account().first();
    const artist = await Artist.findBy("account_id", acct.id);
    const songs = await artist
      .songs()
      .with("audioFile")
      .with("imageFile")
      .fetch();

    return view.render("artist.songs.index", { songs: songs.rows });
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
  async create({ request, response, view }) {
    const results = await Genre.query().orderBy("name").fetch();
    const genres = results.rows;

    return view.render("artist.songs.create", { genres: genres });
  }

  /**
   * Create/save a new song.
   * POST songs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth, session }) {
    const rules = {
      song_title: "required",
      genre: "required|integer",
      image_file_id: "required|integer",
      audio_file_id: "required|integer",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }

    /**
     * TODO:
     * - Save song
     * - Add to artist_songs
     * - redirect to music page
     */
    const songData = request.only([
      "song_title",
      "genre",
      "image_file_id",
      "audio_file_id",
    ]);

    const song = await Song.create({
      title: songData.song_title,
      audio_file_id: songData.audio_file_id,
      image_file_id: songData.image_file_id,
      genre_id: songData.genre,
    });

    const acct = await auth.authenticator("session").user.account().first();
    const artist = await Artist.findBy("account_id", acct.id);

    const artistSong = await ArtistSong.create({
      artist_id: artist.id,
      song_id: song.id,
    });

    session.flash({ success: "Your song was submitted!" });
    return response.route("artist.songs.index");
  }

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
