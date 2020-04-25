"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class StorePurchaseStatusSchema extends Schema {
  async up() {
    const exists = await this.hasTable("store_purchase_statuses");
    if (exists) {
      this.raw(
        `INSERT INTO store_purchase_statuses (id, name) VALUES (1, 'processing');`
      );
      this.raw(
        `INSERT INTO store_purchase_statuses (id, name) VALUES (2, 'shipped');`
      );
      this.raw(
        `INSERT INTO store_purchase_statuses (id, name) VALUES (3, 'delivered');`
      );
    }
  }

  async down() {
    const exists = await this.hasTable("store_purchase_statuses");
    if (exists) {
      const sql = `
          TRUNCATE store_purchase_statuses;
        `;

      this.raw(sql);
    }
  }
}

module.exports = StorePurchaseStatusSchema;
