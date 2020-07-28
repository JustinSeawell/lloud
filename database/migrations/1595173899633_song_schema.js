"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SongSchema extends Schema {
  up() {
    this.table("songs", (table) => {
      table.bigInteger("genre_id").after("image_file_id").defaultTo(0);
      table.datetime("approved_at").after("genre_id");
      table.datetime("rejected_at").after("approved_at");
    });
  }

  down() {
    this.table("songs", (table) => {
      table.dropColumn("genre_id");
      table.dropColumn("approved_at");
      table.dropColumn("rejected_at");
    });
  }
}

module.exports = SongSchema;
