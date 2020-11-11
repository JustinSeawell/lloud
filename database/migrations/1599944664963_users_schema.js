"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UsersSchema extends Schema {
  up() {
    this.table("users", (table) => {
      table.bigInteger("profile_image_id").nullable().after("is_fake");
    });
  }

  down() {
    this.table("users", (table) => {
      table.dropColumn("profile_image_id");
    });
  }
}

module.exports = UsersSchema;
