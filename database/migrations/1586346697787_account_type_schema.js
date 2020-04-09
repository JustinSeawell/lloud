"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AccountTypeSchema extends Schema {
  async up() {
    const exists = await this.hasTable("account_types");
    if (exists) {
      this.raw(`INSERT INTO account_types (id, name) VALUES (1, 'admin');`);
      this.raw(`INSERT INTO account_types (id, name) VALUES (2, 'listener');`);
      this.raw(`INSERT INTO account_types (id, name) VALUES (3, 'artist');`);
    }
  }

  async down() {
    const exists = await this.hasTable("account_types");
    if (exists) {
      const sql = `
          TRUNCATE account_types;
        `;

      this.raw(sql);
    }
  }
}

module.exports = AccountTypeSchema;
