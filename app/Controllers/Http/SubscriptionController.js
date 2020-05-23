"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const moment = require("moment");

const User = use("App/Models/User");
const Subscription = use("App/Models/Subscription");

/**
 * Resourceful controller for interacting with subscriptions
 */
class SubscriptionController {
  /**
   * Show a list of all subscriptions.
   * GET subscriptions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new subscription.
   * GET subscriptions/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new subscription.
   * POST subscriptions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single subscription.
   * GET subscriptions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing subscription.
   * GET subscriptions/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update subscription details.
   * PUT or PATCH subscriptions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a subscription with id.
   * DELETE subscriptions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}

  /**
   * Upgrade a subscription.
   * POST subscriptions/upgrade
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async upgrade({ auth, request, response }) {
    const user = await User.find(auth.user.id);
    const account = await user.account().fetch();
    const currentSub = await account.activeSubscription().fetch();

    const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");

    /**
     * TODO:
     * - Consider making this a transaction
     */

    currentSub.is_active = 0; // Bye bye!
    currentSub.ended_at = timestamp;
    await currentSub.save();

    const newSub = await Subscription.create({
      account_id: account.id,
      plan_id: 1, // Premium
      started_at: timestamp,
      ended_at: null, // On going
      is_active: 1,
    });

    const newPlan = await newSub.plan().fetch();
    account.likes_balance = newPlan.likes_per_month / 4;
    await account.save();

    return response.ok({
      success: true,
      message: "Subscription upgraded successfully",
    });
  }
}

module.exports = SubscriptionController;
