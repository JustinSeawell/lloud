"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SongSchema extends Schema {
  up() {
    this.create("songs", (table) => {
      table.increments();
      table.string("title").notNullable();
      table.bigInteger("audio_file_id");
      table.bigInteger("image_file_id");
      table.datetime("deleted_at");
      table.bigInteger("deleted_by");
      table.timestamps();
    });
  }

  down() {
    this.drop("songs");
  }
}

module.exports = SongSchema;
