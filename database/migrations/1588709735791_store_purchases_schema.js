"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class StorePurchasesSchema extends Schema {
  up() {
    this.table("store_purchases", (table) => {
      // alter table
      table.string("size").nullable().after("store_item_id");
    });
  }

  down() {
    this.table("store_purchases", (table) => {
      // reverse alternations
      table.dropColumn("size");
    });
  }
}

module.exports = StorePurchasesSchema;
