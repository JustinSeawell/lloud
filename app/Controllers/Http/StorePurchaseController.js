"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use("Database");
const { validate } = use("Validator");

const StoreItem = use("App/Models/StoreItem");
const Account = use("App/Models/Account");
const StorePurchase = use("App/Models/StorePurchase");

/**
 * Resourceful controller for interacting with storepurchases
 */
class StorePurchaseController {
  /**
   * Show a list of all storepurchases.
   * GET storepurchases
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new storepurchase.
   * GET storepurchases/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new storepurchase.
   * POST storepurchases
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const rules = {
      store_item_id: "required",
    };

    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return validation.messages();
    }
    const purchaseData = request.only(["store_item_id", "size"]);

    const storeItem = await StoreItem.find(purchaseData.store_item_id);

    if (!storeItem) {
      return response.notFound({
        success: false,
        message: "Store item not found",
      });
    }

    if (storeItem.qty <= 0) {
      return response.ok({
        success: false,
        message: "Store item is out of stock",
      });
    }

    const acct = await Account.findBy("user_id", auth.user.id);

    if (!acct) {
      return response.notFound({
        success: false,
        message: "User account not found",
      });
    }

    if (acct.points_balance < storeItem.cost) {
      return response.ok({
        success: false,
        message: "Not enough points to purchase this item",
      });
    }

    purchaseData.user_id = auth.user.id;
    purchaseData.cost = storeItem.cost; // Record item cost at time of purchase

    const trx = await Database.beginTransaction();

    try {
      const purchase = await StorePurchase.create(purchaseData, trx);

      acct.points_balance -= storeItem.cost;
      await acct.save(trx);

      storeItem.qty--;
      await storeItem.save(trx);

      if (purchaseData.size) {
        const requestedSize = await storeItem.size(purchaseData.size).first();

        if (requestedSize.qty <= 0) {
          await trx.rollback();
          return response.ok({
            success: false,
            message: "Item size is out of stock",
          });
        }

        requestedSize.qty--;
        await requestedSize.save(trx);
      }

      await trx.commit();

      return response.created({ success: true, data: purchase });
    } catch (err) {
      await trx.rollback();
      return response.ok({
        success: false,
        message: `Purchase attempt failed: ${err.message}`,
      });
    }
  }

  /**
   * Display a single storepurchase.
   * GET storepurchases/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing storepurchase.
   * GET storepurchases/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update storepurchase details.
   * PUT or PATCH storepurchases/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a storepurchase with id.
   * DELETE storepurchases/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = StorePurchaseController;
