"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.table("users", (table) => {
      table.dropColumn("state");
    });
  }

  down() {
    this.table("users", (table) => {
      table.string("state");
    });
  }
}

module.exports = UserSchema;
