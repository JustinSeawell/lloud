"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AccountTypeSchema extends Schema {
  up() {
    this.create("account_types", (table) => {
      table.increments();
      table.string("name");
      table.timestamps();
    });
  }

  down() {
    this.drop("account_types");
  }
}

module.exports = AccountTypeSchema;
