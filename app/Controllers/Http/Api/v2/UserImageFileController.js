"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use("App/Models/User");
const ImageFile = use("App/Models/ImageFile");
const FileUploader = use("App/Services/FileUploader");
const Helpers = use("Helpers");
const Drive = use("Drive");
const sharp = require("sharp");

/**
 * Resourceful controller for interacting with userimagefiles
 */
class UserImageFileController {
  /**
   * Show a list of all userimagefiles.
   * GET userimagefiles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, params }) {
    const user = await User.find(params.user_id);
    if (!user) {
      return response.notFound({
        status: "fail",
        data: "User not found",
      });
    }

    const imageFile = await user.profileImg().first();

    return response.ok({
      status: "success",
      data: {
        imageFile,
      },
    });
  }

  /**
   * Render a form to be used for creating a new userimagefile.
   * GET userimagefiles/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new userimagefile.
   * POST userimagefiles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, params, auth }) {
    const thisUser = await auth.getUser();

    if (thisUser.id != params.user_id) {
      return response.unauthorized({
        status: "fail",
        data: "User is not authorized",
      });
    }

    const image = request.file("image", {
      types: ["image"],
      size: "3mb",
      extnames: ["png", "PNG", "jpg", "JPG", "jpeg", "JPEG"],
    });

    if (!image) {
      return response.badRequest({
        status: "fail",
        data: "Image file required",
      });
    }

    const uploader = FileUploader.create();
    const filename = uploader.processFileName(image);

    await image.move(Helpers.tmpPath("uploads"), {
      name: filename,
      overwrite: true,
    });

    if (!image.moved()) {
      return response.badRequest({
        status: "fail",
        data: image.error().message,
      });
    }

    const tmpPath = Helpers.tmpPath(`uploads/${filename}`);
    const imageOnServer = sharp(tmpPath);

    const metadata = await imageOnServer.metadata();
    if (metadata.width > 8000 || metadata.height > 8000) {
      return response.badRequest({
        status: "fail",
        message: "Profile image dimensions are too large",
      });
    }

    const tmpOptPath = Helpers.tmpPath(`uploads/opt_${filename}`);
    await imageOnServer
      .resize(800, 800, {
        fit: "outside",
      })
      .withMetadata()
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

    const url = `https://images.lloudapp.com/${filename}`;

    const imageFile = await ImageFile.create({
      name: filename,
      location: url,
      s3_bucket: "lloud_images",
    });

    thisUser.profile_image_id = imageFile.id;
    await thisUser.save();

    return response.created({
      status: "success",
      data: { imageFile },
    });
  }

  /**
   * Display a single userimagefile.
   * GET userimagefiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing userimagefile.
   * GET userimagefiles/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update userimagefile details.
   * PUT or PATCH userimagefiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a userimagefile with id.
   * DELETE userimagefiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response, auth }) {
    const thisUser = await auth.getUser();

    if (thisUser.id != params.user_id) {
      return response.unauthorized({
        status: "fail",
        data: "User is not authorized",
      });
    }

    const user = await User.find(params.user_id);
    if (!user) {
      return response.notFound({
        status: "fail",
        data: "User not found",
      });
    }

    const imageFile = await user.profileImg().first();

    if (!imageFile) {
      return response.notFound({
        status: "fail",
        data: "Image not found",
      });
    }

    if (imageFile.id != params.id) {
      return response.notFound({
        status: "fail",
        data: "Image not found for this user",
      });
    }

    user.profile_image_id = null;
    await user.save();
    await Drive.disk("lloud_images").delete(imageFile.name);
    await imageFile.delete();

    return response.ok({
      status: "success",
      data: "Profile image deleted",
    });
  }
}

module.exports = UserImageFileController;
