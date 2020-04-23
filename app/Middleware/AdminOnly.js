"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class AdminOnly {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth, response, session }, next) {
    try {
      const user = await auth.authenticator("session").getUser();
      const acct = await user.account().fetch();
      if (acct.account_type_id !== 1) {
        throw new Error("Only admin users are allowed.");
      }
    } catch (err) {
      session.flash({ error: err.message });
      return response.route("admin.login");
    }

    await next();
  }
}

module.exports = AdminOnly;
