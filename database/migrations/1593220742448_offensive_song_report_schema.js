'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OffensiveSongReportSchema extends Schema {
  up () {
    this.create('offensive_song_reports', (table) => {
      table.increments()
      table.bigInteger("user_id");
      table.bigInteger("song_id");
      table.timestamps()
    })
  }

  down () {
    this.drop('offensive_song_reports')
  }
}

module.exports = OffensiveSongReportSchema
