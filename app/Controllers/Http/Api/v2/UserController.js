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
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, event, auth }) {
    const rules = {
      username: "required|unique:users",
      email: "required|email|unique:users",
      password: "required",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.badRequest({
        status: "fail",
        data: validation.messages(),
      });
    }
    const userData = request.only(["username", "email", "password"]);

    try {
      const user = await UserRegistration.registerListenerDefaultAccount(
        userData
      );
      const account = await user.account().fetch();
      const bearerToken = await auth.generate(user, { account_id: account.id });

      return response.header("x-auth-token", bearerToken.token).created({
        status: "success",
        data: user,
      });
    } catch (err) {
      return response.badRequest({
        status: "fail",
        data: { message: "User registration failed" },
      });
    }
  }

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
      return response.badRequest({
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
      "state_id",
      "zipcode",
      "country",
    ]);

    user.merge(userData);
    await user.save();

    return response.ok({
      status: "success",
      data: user,
    });
  }
}

module.exports = UserController;
