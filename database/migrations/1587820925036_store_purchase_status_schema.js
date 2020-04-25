"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class StorePurchaseStatusSchema extends Schema {
  up() {
    this.create("store_purchase_statuses", (table) => {
      table.increments();
      table.string("name");
      table.timestamps();
    });
  }

  down() {
    this.drop("store_purchase_statuses");
  }
}

module.exports = StorePurchaseStatusSchema;
