"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate } = use("Validator");
const Account = use("App/Models/Account");

/**
 * Resourceful controller for interacting with accounts
 */
class AccountController {
  async me({ auth, response }) {
    const user = await auth.getUser();
    const acct = await user.account().fetch();

    try {
      return response.ok({ success: true, data: acct });
    } catch (error) {
      response.send("Missing or invalid jwt token");
    }
  }

  /**
   * Show a list of all accounts.
   * GET accounts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new account.
   * GET accounts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new account.
   * POST accounts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single account.
   * GET accounts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing account.
   * GET accounts/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update account details.
   * PUT or PATCH accounts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    let account;
    try {
      account = await Account.findOrFail(params.id);
    } catch (e) {
      return response.notFound({
        status: "fail",
        data: "Account not found",
      });
    }

    if (account.user_id != auth.user.id) {
      return response.unauthorized({
        status: "fail",
        data: "Not authorized to make updates on this account",
      });
    }

    const rules = {
      user_id: "required",
      account_type_id: "required",
      points_balance: "required",
      likes_balance: "required",
    };

    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.badRequest({
        status: "fail",
        data: validation.messages(),
      });
    }

    const acctData = request.only([
      "user_id",
      "account_type_id",
      "points_balance",
      "likes_balance",
    ]);

    account.merge(acctData);
    await account.save();

    return response.ok({
      status: "success",
      data: account,
    });
  }

  /**
   * Delete a account with id.
   * DELETE accounts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = AccountController;
