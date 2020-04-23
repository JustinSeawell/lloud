"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PlansSchema extends Schema {
  async up() {
    const exists = await this.hasTable("plans");
    if (exists) {
      this.raw(
        `INSERT INTO plans (id, name, likes_per_month, price_per_month, price_per_year) VALUES (3, 'Artist Free', 20, 0, 0);`
      );
    }
  }

  async down() {
    const exists = await this.hasTable("plans");
    if (exists) {
      this.raw(`DELETE FROM plans WHERE id = 3;`);
    }
  }
}

module.exports = PlansSchema;
