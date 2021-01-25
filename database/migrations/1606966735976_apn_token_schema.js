"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ApnTokenSchema extends Schema {
  up() {
    this.create("apn_tokens", (table) => {
      table.increments();
      table.bigInteger("user_id");
      table.string("token");
      table.timestamps();
    });
  }

  down() {
    this.drop("apn_tokens");
  }
}

module.exports = ApnTokenSchema;
