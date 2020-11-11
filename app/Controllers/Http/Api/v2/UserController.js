"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/framework/src/Event')} Event */

const moment = require("moment");

const UserRegistration = use("App/Services/UserRegistration");

const { validate } = use("Validator");
const User = use("App/Models/User");
const Account = use("App/Models/Account");

class UserController {
  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    return await User.query().where("id", params.id).with("profileImg").first();
  }

  /**
   * Update like details.
   * PUT or PATCH likes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    let user;
    try {
      user = await User.findOrFail(params.id);
    } catch (e) {
      return response.notFound({
        status: "fail",
        data: "User not found",
      });
    }

    if (params.id != auth.user.id) {
      return response.unauthorized({
        status: "fail",
        data: "Not authorized to make updates on this user",
      });
    }

    const rules = {
      email: "required|email",
      username: "required",
    };

    /**
     * Check to make sure the user is changing to an
     * available username/email.
     */
    const { username, email } = request.all();
    if (user.username != username) {
      rules.username += "|unique:users";
    }
    if (user.email != email) {
      rules.email += "|unique:users";
    }

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.ok({
        status: "fail",
        data: validation.messages(),
      });
    }

    const userData = request.only([
      "firstname",
      "lastname",
      "username",
      "email",
      "address1",
      "address2",
      "city",
      "state",
      "zipcode",
      "country",
    ]);

    user.merge(userData);
    await user.save();

    return response.ok({
      status: "success",
      data: null,
    });
  }

}

module.exports = UserController;
