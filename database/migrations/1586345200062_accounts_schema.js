"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AccountsSchema extends Schema {
  up() {
    this.table("accounts", (table) => {
      // alter table
      table
        .bigInteger("points_balance")
        .after("account_type_id")
        .notNullable()
        .defaultTo(0);
      table
        .bigInteger("likes_balance")
        .after("points_balance")
        .notNullable()
        .defaultTo(0);
    });
  }

  down() {
    this.table("accounts", (table) => {
      // reverse alternations
      table.dropColumn("points_balance");
      table.dropColumn("likes_balance");
    });
  }
}

module.exports = AccountsSchema;
