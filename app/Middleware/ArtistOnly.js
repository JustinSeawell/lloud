"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class ArtistOnly {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth, response, session }, next) {
    try {
      const user = await auth.authenticator("session").getUser();
      const acct = await user.account().first();

      if (acct.account_type_id !== 3) {
        throw new Error("Only artist users are allowed.");
      }
    } catch (err) {
      session.flash({ error: err.message });
      return response.route("artist.home");
    }

    await next();
  }
}

module.exports = ArtistOnly;
