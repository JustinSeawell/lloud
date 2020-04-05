"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ArtistSongSchema extends Schema {
  up() {
    this.create("artist_songs", table => {
      table.bigInteger("artist_id");
      table.bigInteger("song_id");
    });
  }

  down() {
    this.drop("artist_songs");
  }
}

module.exports = ArtistSongSchema;
