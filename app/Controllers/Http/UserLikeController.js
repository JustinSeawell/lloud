"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Like = use("App/Models/Like");
const User = use("App/Models/User");

/**
 * Resourceful controller for interacting with userlikes
 */
class UserLikeController {
  /**
   * Show a list of all userlikes.
   * GET userlikes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, params, auth }) {
    try {
      await User.findOrFail(params.user_id);
    } catch (e) {
      return response.notFound({
        status: "fail",
        data: "User not found",
      });
    }
    const page = request.input("page") || 1;

    const likes = await Like.query()
      .with("song", (builder) => {
        builder
          .withCount("likes")
          .withCount("likes as liked_by_user", (builder2) => {
            builder2.where("user_id", auth.user.id);
          })
          .withCount("plays")
          .with("artists")
          .with("audioFile")
          .with("imageFile");
      })
      .orderBy("created_at", "desc")
      .where({ user_id: params.user_id })
      .forPage(page, 10)
      .fetch();

    return response.ok({
      status: "success",
      data: { likes: likes },
    });
  }

  /**
   * Render a form to be used for creating a new userlike.
   * GET userlikes/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new userlike.
   * POST userlikes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single userlike.
   * GET userlikes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing userlike.
   * GET userlikes/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update userlike details.
   * PUT or PATCH userlikes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a userlike with id.
   * DELETE userlikes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = UserLikeController;
