"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ArtistSongSchema extends Schema {
  up() {
    this.table("artist_songs", (table) => {
      // alter table
      table.timestamps();
    });
  }

  down() {
    this.table("artist_songs", (table) => {
      table.dropColumn("created_at");
      table.dropColumn("updated_at");
    });
  }
}

module.exports = ArtistSongSchema;
