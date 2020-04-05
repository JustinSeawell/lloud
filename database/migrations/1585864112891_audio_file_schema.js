"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AudioFileSchema extends Schema {
  up() {
    this.create("audio_files", table => {
      table.increments();
      table.string("name", 254).notNullable();
      table.string("location", 499).notNullable();
      table.string("s3_bucket", 254);
      table.bigInteger("uploaded_by");
      table.timestamps();
    });
  }

  down() {
    this.drop("audio_files");
  }
}

module.exports = AudioFileSchema;
