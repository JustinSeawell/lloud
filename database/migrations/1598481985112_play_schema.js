"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PlaySchema extends Schema {
  up() {
    this.create("plays", (table) => {
      table.increments();
      table.bigInteger("user_id");
      table.bigInteger("song_id");
      table.time("duration");
      table.timestamps();
    });
  }

  down() {
    this.drop("plays");
  }
}

module.exports = PlaySchema;
