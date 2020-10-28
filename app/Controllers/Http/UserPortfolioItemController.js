"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Like = use("App/Models/Like");

/**
 * Resourceful controller for interacting with userportfolioitems
 */
class UserPortfolioItemController {
  /**
   * Show a list of all userportfolioitems.
   * GET userportfolioitems
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const user = await User.find(params.user_id);
    if (!user) {
      return response.notFound({
        status: "fail",
        data: "User not found",
      });
    }

    const results = await Like.query()
      .with("song.artists")
      .with("song.audioFile")
      .with("song.imageFile")
      .with("song.likes")
      .orderBy("created_at", "desc")
      .where({ user_id: user.id })
      .fetch();

    var portfolioItems = results.rows.map((result) => {});
  }

  /**
   * Render a form to be used for creating a new userportfolioitem.
   * GET userportfolioitems/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new userportfolioitem.
   * POST userportfolioitems
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single userportfolioitem.
   * GET userportfolioitems/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing userportfolioitem.
   * GET userportfolioitems/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update userportfolioitem details.
   * PUT or PATCH userportfolioitems/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a userportfolioitem with id.
   * DELETE userportfolioitems/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = UserPortfolioItemController;
