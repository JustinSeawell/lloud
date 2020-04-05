"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ArtistSchema extends Schema {
  up() {
    this.create("artists", table => {
      table.increments();
      table.string("name").notNullable();
      table.string("city").notNullable();
      table.string("state").notNullable();
      table.string("zipcode").notNullable();
      table.string("country").notNullable();
      table.text("description");
      table.timestamp("deleted_at");
      table.timestamps();
    });
  }

  down() {
    this.drop("artists");
  }
}

module.exports = ArtistSchema;
