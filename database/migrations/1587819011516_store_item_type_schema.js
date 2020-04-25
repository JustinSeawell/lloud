"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class StoreItemTypeSchema extends Schema {
  up() {
    this.create("store_item_types", (table) => {
      table.increments();
      table.string("name");
      table.timestamps();
    });
  }

  down() {
    this.drop("store_item_types");
  }
}

module.exports = StoreItemTypeSchema;
