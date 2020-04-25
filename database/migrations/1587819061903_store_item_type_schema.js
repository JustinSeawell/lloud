"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class StoreItemTypeSchema extends Schema {
  async up() {
    const exists = await this.hasTable("store_item_types");
    if (exists) {
      this.raw(`INSERT INTO store_item_types (id, name) VALUES (1, 'shirt');`);
      this.raw(
        `INSERT INTO store_item_types (id, name) VALUES (2, 'sticker');`
      );
    }
  }

  async down() {
    const exists = await this.hasTable("store_item_types");
    if (exists) {
      const sql = `
          TRUNCATE store_item_types;
        `;

      this.raw(sql);
    }
  }
}

module.exports = StoreItemTypeSchema;
