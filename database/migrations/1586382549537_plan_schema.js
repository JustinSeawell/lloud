"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PlanSchema extends Schema {
  async up() {
    const exists = await this.hasTable("plans");
    if (exists) {
      this.raw(
        `INSERT INTO plans (id, name, likes_per_month, price_per_month, price_per_year) VALUES (1, 'Default', 20, 10.00, 90.00);`
      );
      this.raw(
        `INSERT INTO plans (id, name, likes_per_month, price_per_month, price_per_year) VALUES (2, 'Default 1st month offer', 20, 0, 0);`
      );
    }
  }

  async down() {
    const exists = await this.hasTable("plans");
    if (exists) {
      const sql = `
          TRUNCATE plans;
        `;

      this.raw(sql);
    }
  }
}

module.exports = PlanSchema;
