"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class StoreItemSchema extends Schema {
  up() {
    this.create("store_items", (table) => {
      table.increments();
      table.string("name").notNullable();
      table.bigInteger("image_file_id");
      table.text("description");
      table.bigInteger("cost").notNullable();
      table.bigInteger("qty").notNullable();
      table.bigInteger("store_item_type_id").notNullable();
      table.boolean("coming_soon").notNullable().defaultTo(false);
      table.datetime("deleted_at").nullable();
      table.bigInteger("deleted_by").nullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("store_items");
  }
}

module.exports = StoreItemSchema;
