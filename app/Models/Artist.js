"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Like = use("App/Models/Like");

class Artist extends Model {
  songs() {
    return this.belongsToMany("App/Models/Song").pivotTable("artist_songs");
  }

  async getTotalLikes() {
    const songs = await this.songs().select("id").fetch();
    const songIds = songs.rows.map((song) => {
      return song.id;
    });

    const result = await Like.query()
      .whereIn("song_id", songIds)
      .count("* as total");
    return result[0].total;
  }

  async getSongIds() {
    return await this.songs()
      .whereNull("deleted_at")
      .whereNotNull("approved_at")
      .orderBy("approved_at", "desc")
      .ids();
  }
}

module.exports = Artist;
