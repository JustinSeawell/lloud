'use strict'

/*
|--------------------------------------------------------------------------
| EntityTypeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const EntityType = use("App/Models/EntityType");

class EntityTypeSeeder {
  async run () {
    const types = [
      { name: "artist"},
      { name: "user"},
      { name: "song"},
    ];

    await EntityType.createMany(types);
  }
}

module.exports = EntityTypeSeeder
