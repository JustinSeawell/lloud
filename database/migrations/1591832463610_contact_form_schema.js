"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ContactFormSchema extends Schema {
  up() {
    this.create("contact_forms", (table) => {
      table.increments();
      table.string("email");
      table.string("subject");
      table.text("message");
      table.timestamps();
    });
  }

  down() {
    this.drop("contact_forms");
  }
}

module.exports = ContactFormSchema;
