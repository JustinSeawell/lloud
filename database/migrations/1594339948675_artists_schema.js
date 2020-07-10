"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ArtistsSchema extends Schema {
  up() {
    this.table("artists", (table) => {
      table.string("email").notNullable().defaultTo("").after("name");
    });
  }

  down() {
    this.table("artists", (table) => {
      table.dropColumn("email");
    });
  }
}

module.exports = ArtistsSchema;
