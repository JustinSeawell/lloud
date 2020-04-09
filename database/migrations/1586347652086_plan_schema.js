"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PlanSchema extends Schema {
  up() {
    this.create("plans", (table) => {
      table.increments();
      table.string("name").notNullable();
      table.bigInteger("likes_per_month").notNullable().defaultTo(0);
      table.decimal("price_per_month").notNullable();
      table.decimal("price_per_year").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("plans");
  }
}

module.exports = PlanSchema;
