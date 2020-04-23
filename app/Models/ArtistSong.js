"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ArtistSong extends Model {
  static get table() {
    return "artist_songs";
  }
}

module.exports = ArtistSong;
