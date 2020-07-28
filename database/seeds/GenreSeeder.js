"use strict";

/*
|--------------------------------------------------------------------------
| GenreSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Genre = use("App/Models/Genre");

class GenreSeeder {
  async run() {
    const genres = [
      { name: "alternative", display_name: "Alternative" },
      { name: "ambient", display_name: "Ambient" },
      { name: "rock", display_name: "Rock" },
      { name: "hip-hop", display_name: "Hip Hop" },
      { name: "rap", display_name: "Rap" },
      { name: "dubstep", display_name: "Dubstep" },
      { name: "indie", display_name: "Indie" },
      { name: "experimental", display_name: "Experimental" },
      { name: "electronic", display_name: "Electronic" },
      { name: "metal", display_name: "Metal" },
      { name: "punk-rock", display_name: "Punk Rock" },
      { name: "folk", display_name: "Folk" },
      { name: "pop", display_name: "Pop" },
      { name: "r-and-b", display_name: "R&B" },
      { name: "other", display_name: "Other" },
    ];

    await Genre.createMany(genres);
  }
}

module.exports = GenreSeeder;
