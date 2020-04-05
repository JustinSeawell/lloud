"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SubscriptionSchema extends Schema {
  up() {
    this.create("subscriptions", table => {
      table.increments();
      table.bigInteger("account_id");
      table.bigInteger("tier");
      table.timestamp("ended_at");
      table.timestamp("expired_at");
      table.timestamps();
    });
  }

  down() {
    this.drop("subscriptions");
  }
}

module.exports = SubscriptionSchema;
