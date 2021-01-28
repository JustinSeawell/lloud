"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use("App/Models/User");
const ApnToken = use("App/Models/ApnToken");

/**
 * Resourceful controller for interacting with userapntokens
 */
class UserApnTokenController {
  /**
   * Show a list of all userapntokens.
   * GET userapntokens
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new userapntoken.
   * GET userapntokens/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new userapntoken.
   * POST userapntokens
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

    const tokenStr = request.input("token");

    const token = await ApnToken.findOrCreate({
      user_id: params.user_id,
      token: tokenStr,
    });

    return response.created({
      status: "success",
      data: { token },
    });
  }

  /**
   * Display a single userapntoken.
   * GET userapntokens/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing userapntoken.
   * GET userapntokens/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update userapntoken details.
   * PUT or PATCH userapntokens/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a userapntoken with id.
   * DELETE userapntokens/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = UserApnTokenController;
