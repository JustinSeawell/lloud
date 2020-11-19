"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class NotificationTypeSchema extends Schema {
  up() {
    this.create("notification_types", (table) => {
      table.increments();
      table.string("name");
      table.timestamps();
    });
  }

  down() {
    this.drop("notification_types");
  }
}

module.exports = NotificationTypeSchema;
