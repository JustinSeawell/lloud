"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ImageFileSchema extends Schema {
  up() {
    this.create("image_files", table => {
      table.increments();
      table.string("name", 254).notNullable();
      table.string("location", 499).notNullable();
      table.string("s3_bucket", 254);
      table.bigInteger("uploaded_by");
      table.timestamps();
    });
  }

  down() {
    this.drop("image_files");
  }
}

module.exports = ImageFileSchema;
