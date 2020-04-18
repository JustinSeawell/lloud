"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Drive = use("Drive");
const { validate } = use("Validator");

const ArtistApplication = use("App/Models/ArtistApplication");
const FileUploader = use("App/Services/FileUploader");

/**
 * Resourceful controller for interacting with artistapplications
 */
class ArtistApplicationController {
  /**
   * Show a list of all artistapplications.
   * GET artistapplications
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new artistapplication.
   * GET artistapplications/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
    return view.render("artist-application");
  }

  /**
   * Create/save a new artistapplication.
   * POST artistapplications
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, session, auth }) {
    const rules = {
      name: "required|unique:artist_applications",
      description: "required",
      email: "required|email|unique:artist_applications",
      city: "required",
      state: "required",
      zipcode: "required",
      country: "required",
      song_title: "required",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }

    const applicationData = request.only([
      "name",
      "description",
      "email",
      "city",
      "state",
      "zipcode",
      "country",
      "song_title",
    ]);

    const fileUploader = FileUploader.create();

    const audioFile = request.file("audio_file", {
      types: ["audio"],
      // size: "2mb",
      extnames: ["mp3"],
    });
    const uploadedAudioFile = await fileUploader.uploadAudioFileToS3(audioFile);
    applicationData.audio_file_id = uploadedAudioFile.id;

    const artworkFile = request.file("artwork_file", {
      types: ["image"],
      size: "2mb",
    });
    const uploadedArtworkFile = await fileUploader.uploadImageFileToS3(
      artworkFile
    );
    applicationData.image_file_id = uploadedArtworkFile.id;

    await ArtistApplication.create(applicationData);

    session.flash({ notification: "Your Application was Submitted!" });
    return response.redirect("back");
  }

  /**
   * Display a single artistapplication.
   * GET artistapplications/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing artistapplication.
   * GET artistapplications/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update artistapplication details.
   * PUT or PATCH artistapplications/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a artistapplication with id.
   * DELETE artistapplications/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = ArtistApplicationController;
