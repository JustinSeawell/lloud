"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class StorePurchaseSchema extends Schema {
  up() {
    this.create("store_purchases", (table) => {
      table.increments();
      table.bigInteger("user_id");
      table.bigInteger("store_item_id");
      table.bigInteger("cost");
      table.bigInteger("store_purchase_status_id").notNullable().defaultTo(1); // Processing
      table.timestamps();
    });
  }

  down() {
    this.drop("store_purchases");
  }
}

module.exports = StorePurchaseSchema;
