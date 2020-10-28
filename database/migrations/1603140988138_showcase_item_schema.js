'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ShowcaseItemSchema extends Schema {
  up () {
    this.create('showcase_items', (table) => {
      table.increments()
      table.integer("entity_type_id")
      table.bigInteger("entity_id")
      table.integer("slot")
      table.datetime("deleted_at")
      table.timestamps()
    })
  }

  down () {
    this.drop('showcase_items')
  }
}

module.exports = ShowcaseItemSchema
