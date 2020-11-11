'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SearchRequestSchema extends Schema {
  up () {
    this.create('search_requests', (table) => {
      table.increments()
      table.bigInteger("user_id")
      table.string("search_term")
      table.timestamps()
    })
  }

  down () {
    this.drop('search_requests')
  }
}

module.exports = SearchRequestSchema
