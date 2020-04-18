"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.table("users", (table) => {
      // alter table
      table.string("resetPasswordToken").after("country");
      table.datetime("resetPasswordExpires").after("resetPasswordToken");
    });
  }

  down() {
    this.table("users", (table) => {
      // reverse alternations
      table.dropColumn("resetPasswordToken");
      table.dropColumn("resetPasswordExpires");
    });
  }
}

module.exports = UserSchema;
