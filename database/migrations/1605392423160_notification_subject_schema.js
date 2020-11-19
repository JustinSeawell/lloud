"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class NotificationSubjectSchema extends Schema {
  up() {
    this.create("notification_subjects", (table) => {
      table.increments();
      table.bigInteger("notification_id");
      table.integer("entity_type_id");
      table.integer("entity_id");
      table.timestamps();
    });
  }

  down() {
    this.drop("notification_subjects");
  }
}

module.exports = NotificationSubjectSchema;
