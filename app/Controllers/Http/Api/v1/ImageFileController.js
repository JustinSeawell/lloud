"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const FileUploader = use("App/Services/FileUploader");
const Helpers = use("Helpers");
const Drive = use("Drive");
const sharp = require("sharp");
const ImageFile = use("App/Models/ImageFile");

/**
 * Resourceful controller for interacting with imagefiles
 */
class ImageFileController {
  /**
   * Show a list of all imagefiles.
   * GET imagefiles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new imagefile.
   * GET imagefiles/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new imagefile.
   * POST imagefiles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const image = request.file("image_file", {
      types: ["image"],
      size: "2mb",
      extnames: ["png", "PNG", "jpg", "JPG", "jpeg", "JPEG"],
    });

    if (!image) {
      return response.ok({
        success: false,
        message: "Image file required",
      });
    }

    const uploader = FileUploader.create();
    const filename = uploader.processFileName(image);

    await image.move(Helpers.tmpPath("uploads"), {
      name: filename,
      overwrite: true,
    });

    if (!image.moved()) {
      return response.ok({
        success: false,
        message: image.error().message,
      });
    }

    const tmpPath = Helpers.tmpPath(`uploads/${filename}`);
    const imageOnServer = sharp(tmpPath);

    try {
      const metadata = await imageOnServer.metadata();
      if (metadata.width < 1000 || metadata.height < 1000) {
        throw Error("Cover art dimensions are too small.");
      }

      if (metadata.width > 4000 || metadata.height > 4000) {
        throw Error("Cover art dimensions are too large.");
      }
    } catch (err) {
      return response.ok({
        success: false,
        message: err.message,
      });
    }

    const tmpOptPath = Helpers.tmpPath(`uploads/opt_${filename}`);
    const optimizedFile = await imageOnServer
      .resize(3000, 3000, {
        fit: "outside",
      })
      .toFormat("jpeg")
      .jpeg({ quality: 75, chromaSubsampling: "4:4:4" })
      .toFile(tmpOptPath);

    await Drive.disk("lloud_images").put(
      filename,
      await Drive.get(tmpOptPath),
      {
        ContentType: `image/jpeg`,
      }
    );

    await Drive.delete(tmpPath);
    await Drive.delete(tmpOptPath);

    // const url = `https://images.lloudapp.com/${filename}`;
    const url = `https://ik.imagekit.io/mvp1bbxuku/${filename}`;

    const imageFile = await ImageFile.create({
      name: filename,
      location: url,
      s3_bucket: "lloud_images",
    });

    return response.ok({ success: true, file_id: imageFile.id, url: url });
  }

  /**
   * Display a single imagefile.
   * GET imagefiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing imagefile.
   * GET imagefiles/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update imagefile details.
   * PUT or PATCH imagefiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a imagefile with id.
   * DELETE imagefiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = ImageFileController;
