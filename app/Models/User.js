"use strict";

const Model = use("Model");

class User extends Model {
  static get hidden() {
    return ["password"];
  }

  static boot() {
    super.boot();

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook("beforeSave", "UserHook.hashPassword");
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany("App/Models/Token");
  }

  account() {
    return this.hasOne("App/Models/Account");
  }
}

module.exports = User;
