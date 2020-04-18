"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ArtistApplicationSchema extends Schema {
  up() {
    this.create("artist_applications", (table) => {
      table.increments();
      table.string("name");
      table.text("description");
      table.string("email");
      table.string("city");
      table.string("state");
      table.string("zipcode");
      table.string("country");
      table.string("song_title");
      table.bigInteger("audio_file_id");
      table.bigInteger("image_file_id");
      table.timestamp("approved_at");
      table.timestamps();
    });
  }

  down() {
    this.drop("artist_applications");
  }
}

module.exports = ArtistApplicationSchema;
