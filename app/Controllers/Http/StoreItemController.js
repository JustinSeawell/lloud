"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const StoreItem = use("App/Models/StoreItem");

/**
 * Resourceful controller for interacting with storeitems
 */
class StoreItemController {
  /**
   * Show a list of all storeitems.
   * GET storeitems
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, params }) {
    const page = params.page || 1;

    const results = await StoreItem.query()
      .whereNull("deleted_at")
      .paginate(page);

    response.send(results);
  }

  /**
   * Render a form to be used for creating a new storeitem.
   * GET storeitems/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new storeitem.
   * POST storeitems
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single storeitem.
   * GET storeitems/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const storeItem = await StoreItem.query()
      .where("id", params.id)
      .with("imageFile")
      .first();

    if (!storeItem) {
      return response.notFound({
        success: false,
        message: "Store item not found",
      });
    }

    response.send(storeItem);
  }

  /**
   * Render a form to update an existing storeitem.
   * GET storeitems/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update storeitem details.
   * PUT or PATCH storeitems/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a storeitem with id.
   * DELETE storeitems/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = StoreItemController;
