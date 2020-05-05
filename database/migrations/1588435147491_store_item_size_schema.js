"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class StoreItemSizeSchema extends Schema {
  up() {
    this.create("store_item_sizes", (table) => {
      table.increments();
      table.string("size").notNullable();
      table.bigInteger("store_item_id").notNullable();
      table.bigInteger("qty").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("store_item_sizes");
  }
}

module.exports = StoreItemSizeSchema;
