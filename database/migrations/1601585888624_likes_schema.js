"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class LikesSchema extends Schema {
  up() {
    this.table("likes", (table) => {
      table
        .bigInteger("points_earned")
        .after("song_id")
        .notNullable()
        .defaultTo(0);
    });
  }

  down() {
    this.table("likes", (table) => {
      table.dropColumn("points_balance");
    });
  }
}

module.exports = LikesSchema;
