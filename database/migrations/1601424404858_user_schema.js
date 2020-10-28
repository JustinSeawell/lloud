"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.table("users", (table) => {
      table.integer("state").nullable().after("city");
    });
  }

  down() {
    this.table("users", (table) => {
      table.dropColumn("state");
    });
  }
}

module.exports = UserSchema;
