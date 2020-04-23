"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const moment = require("moment");

const Event = use("Event");
const { validate } = use("Validator");

const ArtistApplication = use("App/Models/ArtistApplication");
const FileUploader = use("App/Services/FileUploader");
const ArtistRegistration = use("App/Services/ArtistRegistration");

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
  async index({ request, response, params, view }) {
    const page = params.page || 1;

    const artistApplications = await ArtistApplication.query()
      .with("audioFile")
      .with("imageFile")
      .paginate(page);

    return view.render("admin.artist-applications", {
      artistApplications: artistApplications.toJSON(),
    });
  }

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
      name: "required|unique:artist_applications|unique:users,username",
      description: "required",
      email: "required|email|unique:artist_applications|unique:users,email",
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
  async show({ params, request, response, view }) {
    const application = await ArtistApplication.query()
      .where("id", params.id)
      .with("audioFile")
      .with("imageFile")
      .first();

    return view.render("admin.artist-application", {
      application: application.toJSON(),
    });
  }

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
  async update({ params, request, response }) {
    const req = request.only(["app_id", "result"]);

    try {
      const application = await ArtistApplication.findOrFail(
        parseInt(req.app_id)
      );

      const nowStr = moment().format("YYYY-MM-DD HH:mm:ss");
      if (req.result == "approve") {
        application.approved_at = nowStr;
      } else if (req.result == "deny") {
        application.rejected_at = nowStr;
      }

      await application.save();

      // Approved
      // - create artist
      // - create song
      // - associate them
      // - send email
      if (req.result == "approve") {
        await ArtistRegistration.registerArtist(application);
      } else if (req.result == "deny") {
        Event.fire("artist_application::denied", application.toJSON());
      }
    } catch (err) {
      console.log(err);
    }

    // ArtistApplication.find();
    return response.route("admin.artist-apps");
  }

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
