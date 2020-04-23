"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ArtistApplication extends Model {
  audioFile() {
    return this.belongsTo("App/Models/AudioFile");
  }

  imageFile() {
    return this.belongsTo("App/Models/ImageFile");
  }
}

module.exports = ArtistApplication;
