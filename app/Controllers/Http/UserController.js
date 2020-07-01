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
const Subscription = use("App/Models/Subscription");

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, event }) {
    const rules = {
      username: "required|unique:users",
      email: "required|email|unique:users",
      password: "required",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return validation.messages();
    }
    const userData = request.only(["username", "email", "password"]);

    try {
      const user = await UserRegistration.registerListenerDefaultAccount(
        userData
      );

      return response.created({ success: true, message: user });
    } catch (err) {
      return {
        success: false,
        message: "User registration failed.",
      };
    }
  }

  async validateEmail({ request, response }) {
    const rules = {
      email: "required|email|unique:users",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.ok({
        success: false,
        message: "Email is already taken",
      });
    }

    return response.send({ success: true, message: "Email is valid" });
  }

  async validateUsername({ request, response }) {
    const rules = {
      username: "required|unique:users",
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.ok({
        success: false,
        message: "Username is already taken",
      });
    }

    return response.send({ success: true, message: "Username is valid" });
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
    return await User.findByOrFail("id", params.id);
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
    const user = await User.findOrFail(auth.user.id);

    if (!user) {
      return response.notFound({
        success: false,
        message: "User not found",
      });
    }

    const rules = {
      email: "required|email",
    };

    const usernameReq = request.only(["username"]);
    if (user.username != usernameReq.username) {
      rules.username = "required|unique:users";
    }

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.ok({
        success: false,
        message: "Please provide a unique username and email address",
      });
    }

    const emailReq = request.only(["email"]);
    if (user.email != emailReq.email) {
      return response.unauthorized({
        success: false,
        message: "Email not associated with this user id",
      });
    }

    const userData = request.only([
      "firstname",
      "lastname",
      "username",
      "address1",
      "address2",
      "city",
      "state",
      "zipcode",
      "country",
    ]);

    user.merge(userData);
    await user.save();

    return response.ok({ success: true, message: "User updated successfully" });
  }

  async login({ auth, request }) {
    const { email, password } = request.all();
    const output = await auth.attempt(email, password);

    return output;
  }

  async adminLogin({ auth, request, response }) {
    const { email, password } = request.all();
    await auth.authenticator("session").attempt(email, password);

    return response.route("ArtistApplicationController.index");
  }

  async me({ auth, response }) {
    try {
      return response.ok({ success: true, data: await auth.getUser() });
    } catch (error) {
      response.send("Missing or invalid jwt token");
    }
  }

  async likesBalance({ auth, request, response }) {
    const acct = await Account.findBy("user_id", auth.user.id);
    if (!acct) {
      return response.notFound({
        success: false,
        message: "Account not found.",
      });
    }
    const sub = await acct.activeSubscription().fetch();
    const plan = await sub.plan().fetch();
    const weeklyLikesAllowance = plan.likes_per_month / 4; // TODO: Deprecate

    const subEndDay = sub.ended_at ? moment(sub.ended_at) : null;
    const refillDay = moment().add(1, "months").startOf("month"); // First day of next month

    let refilledAtStr;
    if (subEndDay !== null && refillDay.isAfter(subEndDay)) {
      refilledAtStr = "No Refills Remaining";
    } else if (moment().isSame(refillDay, "day")) {
      refilledAtStr = "Today";
    } else {
      refilledAtStr = refillDay.format("MMMM Do");
    }

    return response.ok({
      success: true,
      data: {
        remaining: acct.likes_balance,
        allowance: weeklyLikesAllowance,
        refilledAt: refilledAtStr,
      },
    });
  }

  async pointsBalance({ auth, request, response }) {
    const acct = await Account.findBy("user_id", auth.user.id);
    if (!acct) {
      return response.notFound({
        success: false,
        message: "Account not found.",
      });
    }

    return response.ok({
      success: true,
      data: { points: acct.points_balance },
    });
  }
}

module.exports = UserController;
