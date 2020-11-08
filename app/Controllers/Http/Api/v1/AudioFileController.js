"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Drive = use("Drive");
const FileUploader = use("App/Services/FileUploader");
const AudioFile = use("App/Models/AudioFile");

/**
 * Resourceful controller for interacting with audiofiles
 */
class AudioFileController {
  /**
   * Show a list of all audiofiles.
   * GET audiofiles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new audiofile.
   * GET audiofiles/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new audiofile.
   * POST audiofiles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    var filename;

    request.multipart.file("audio_file", {}, async (file) => {
      const uploader = FileUploader.create();
      filename = uploader.processFileName(file);

      await Drive.disk("lloud_audio").put(filename, file.stream);
    });

    await request.multipart.process();

    const s3url = await Drive.disk("lloud_audio").getUrl(filename);
    if (!s3url) {
      return response.ok({
        success: false,
        message: "Audio file not found on s3",
      });
    }

    const url = `https://audio.lloudapp.com/${filename}`;

    const audioFile = await AudioFile.create({
      name: filename,
      location: url,
      s3_bucket: "lloud_audio",
    });

    return response.ok({ success: true, file_id: audioFile.id, url: url });
  }

  /**
   * Display a single audiofile.
   * GET audiofiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing audiofile.
   * GET audiofiles/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update audiofile details.
   * PUT or PATCH audiofiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a audiofile with id.
   * DELETE audiofiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = AudioFileController;
