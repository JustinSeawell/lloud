"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class NotificationSchema extends Schema {
  up() {
    this.create("notifications", (table) => {
      table.increments();
      table.bigInteger("user_id");
      table.integer("type");
      table.datetime("seen_at");
      table.timestamps();
    });
  }

  down() {
    this.drop("notifications");
  }
}

module.exports = NotificationSchema;
