"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Song extends Model {
  audioFile() {
    return this.belongsTo("App/Models/AudioFile");
  }

  imageFile() {
    return this.belongsTo("App/Models/ImageFile");
  }

  artists() {
    return this.belongsToMany("App/Models/Artist").pivotTable("artist_songs");
  }

  likes() {
    return this.hasMany("App/Models/Like");
  }
}

module.exports = Song;
