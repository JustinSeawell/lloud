"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PurchaseReceiptSchema extends Schema {
  up() {
    this.create("purchase_receipts", (table) => {
      table.increments();
      table.bigInteger("user_id");
      table.bigInteger("platform");
      table.boolean("is_sandbox").defaultTo(false);
      table.string("product_id").notNullable();
      table.text("verification_data").notNullable();
      table.bigInteger("original_transaction_id");
      table.boolean("verified").defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop("purchase_receipts");
  }
}

module.exports = PurchaseReceiptSchema;
