"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AccountsSchema extends Schema {
  up() {
    this.table("accounts", (table) => {
      table.datetime("deleted_at").nullable().alter();
    });
  }

  down() {
    this.table("accounts", (table) => {
      table.timestamp("deleted_at").alter();
    });
  }
}

module.exports = AccountsSchema;
