"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ArtistApplicationSchema extends Schema {
  up() {
    this.table("artist_applications", (table) => {
      // alter table
      table.datetime("rejected_at").after("approved_at");
    });
  }

  down() {
    this.table("artist_applications", (table) => {
      // reverse alternations
      table.dropColumn("rejected_at");
    });
  }
}

module.exports = ArtistApplicationSchema;
