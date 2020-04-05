"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", table => {
      table.increments();
      table.string("firstname", 80);
      table.string("lastname", 80);
      table
        .string("username", 80)
        .notNullable()
        .unique();
      table
        .string("email")
        .notNullable()
        .unique();
      table.string("password", 60).notNullable();
      table.bigInteger("points");
      table.string("address1");
      table.string("address2");
      table.string("city");
      table.string("state");
      table.string("zipcode");
      table.string("country");
      table.timestamp("deleted_at");
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
