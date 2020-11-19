"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const moment = require("moment");

const User = use("App/Models/User");
const Notification = use("App/Models/Notification");

/**
 * Resourceful controller for interacting with usernotifications
 */
class UserNotificationController {
  /**
   * Show a list of all usernotifications.
   * GET usernotifications
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ auth, params, response, view }) {
    if (auth.user.id != params.user_id) {
      return response.unauthorized({
        status: "fail",
        data: "User is not authorized",
      });
    }

    const notifications = await Notification.query()
      .with("subjects")
      .where("user_id", params.user_id)
      .orderBy("created_at", "desc")
      .fetch();

    for (let notification of notifications.rows) {
      switch (notification.type) {
        case 1:
          for (let subject of notification.getRelated("subjects").rows) {
            switch (subject.entity_type_id) {
              case 1:
                await subject.load("artist");
                break;
              case 2:
                await subject.load("user.profileImg");
                break;
              case 3:
                await subject.load("song.imageFile");
                break;
            }
          }
      }
    }

    return response.ok({
      status: "success",
      data: { notifications },
    });
  }

  /**
   * Show a count of all usernotifications.
   * GET usernotifications
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async count({ request, params, response }) {
    const unreadOnly = request.input("unread") || false;

    const query = Notification.query().where("user_id", params.id);

    if (unreadOnly == 1) {
      query.whereNull("seen_at");
    }

    const count = await query.getCount();

    return response.ok({
      status: "success",
      data: { count },
    });
  }

  /**
   * Render a form to be used for creating a new usernotification.
   * GET usernotifications/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new usernotification.
   * POST usernotifications
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single usernotification.
   * GET usernotifications/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing usernotification.
   * GET usernotifications/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update usernotification details.
   * PUT or PATCH usernotifications/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, auth, response }) {}

  async seen({ params, auth, response }) {
    if (auth.user.id != params.user_id) {
      return response.unauthorized({
        status: "fail",
        data: "User is not authorized",
      });
    }

    const notification = await Notification.query()
      .where("user_id", params.user_id)
      .where("id", params.id)
      .first();

    if (!notification) {
      return response.notFound({
        status: "fail",
        data: "Notification not found",
      });
    }

    notification.seen_at = moment().format("YYYY-MM-DD HH:mm:ss");
    await notification.save();

    return response.ok({
      status: "success",
      data: "Notification updated.",
    });
  }

  /**
   * Delete a usernotification with id.
   * DELETE usernotifications/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = UserNotificationController;
