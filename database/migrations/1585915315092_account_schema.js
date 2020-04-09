"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AccountSchema extends Schema {
  up() {
    this.create("accounts", (table) => {
      table.increments();
      table.bigInteger("user_id");
      table.bigInteger("account_type_id");
      table.timestamp("deleted_at");
      table.timestamps();
    });
  }

  down() {
    this.drop("accounts");
  }
}

module.exports = AccountSchema;
