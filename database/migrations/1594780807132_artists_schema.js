"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ArtistsSchema extends Schema {
  up() {
    this.table("artists", (table) => {
      table.bigInteger("account_id").after("email");
      table.string("city").nullable().alter();
      table.string("state").nullable().alter();
      table.string("zipcode").nullable().alter();
      table.string("country").nullable().alter();
    });
  }

  down() {
    this.table("artists", (table) => {
      table.dropColumn("account_id");
    });
  }
}

module.exports = ArtistsSchema;
