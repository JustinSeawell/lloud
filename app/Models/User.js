"use strict";

const crypto = require("crypto");
const moment = require("moment");

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

  apnTokens() {
    return this.hasMany("App/Models/ApnToken");
  }

  account() {
    return this.hasOne("App/Models/Account");
  }

  notifications() {
    return this.hasMany("App/Models/Notification");
  }

  unreadNotifications() {
    return this.notifications().whereNull("seen_at");
  }

  purchaseReceipt() {
    return this.hasMany("App/Models/PurchaseReceipt");
  }

  profileImg() {
    return this.belongsTo("App/Models/ImageFile", "profile_image_id", "id");
  }

  generatePasswordReset() {
    this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordExpires = moment()
      .add(1, "hours")
      .format("YYYY-MM-DD HH:mm:ss");
  }

  /**
   * When artists register in the app
   * we want to give them a longer window
   * to create a new password
   */
  generateDayLongPasswordReset() {
    this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordExpires = moment()
      .add(1, "days")
      .format("YYYY-MM-DD HH:mm:ss");
  }
}

module.exports = User;
