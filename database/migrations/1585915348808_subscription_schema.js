"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SubscriptionSchema extends Schema {
  up() {
    this.create("subscriptions", (table) => {
      table.increments();
      table.bigInteger("account_id");
      table.bigInteger("plan_id");
      table.datetime("started_at");
      table.datetime("ended_at");
      table.boolean("is_active").notNullable().defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop("subscriptions");
  }
}

module.exports = SubscriptionSchema;
