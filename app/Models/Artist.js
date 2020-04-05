"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Artist extends Model {
  songs() {
    return this.belongsToMany("App/Models/Songs").pivotTable("artist_songs");
  }
}

module.exports = Artist;
