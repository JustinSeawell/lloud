'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Artist = use("App/Models/Artist");
const Song = use("App/Models/Song");
const Like = use("App/Models/Like");
const Play = use("App/Models/Play");
const ShowcaseItem = use("App/Models/ShowcaseItem");

/**
 * Resourceful controller for interacting with showcaseitems
 */
class ShowcaseItemController {
  /**
   * Show a list of all showcaseitems.
   * GET showcaseitems
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const showcaseItems = await ShowcaseItem.all();

    const items = await Promise.all(
      showcaseItems.rows.map(async item => {
        switch (item.entity_type_id) {
          case 1:
            const artist = await Artist.query().where('id', item.entity_id).first();

            item.subject = artist;

            const artistSong = await artist.songs().with("imageFile").first();
            item.subject.imageFile = artistSong.getRelated("imageFile");

            const songIds = await artist.getSongIds();

            item.subject.likes = await Like.query()
              .whereIn("song_id", songIds)
              .getCount();

            item.subject.plays = await Play.query()
              .whereIn("song_id", songIds)
              .getCount();
            break;
          case 3:
            const song = await Song.query().with('imageFile').withCount("likes").withCount("plays").first();
            item.subject = song;
            item.subject.imageFile = song.getRelated('imageFile');
            break;
          default:
            break;
        }
  
        return item;
      })
    );

    return response.ok({
      status: "success",
      data: { showcaseItems: items },
    });
  }

  /**
   * Render a form to be used for creating a new showcaseitem.
   * GET showcaseitems/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new showcaseitem.
   * POST showcaseitems
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single showcaseitem.
   * GET showcaseitems/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing showcaseitem.
   * GET showcaseitems/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update showcaseitem details.
   * PUT or PATCH showcaseitems/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a showcaseitem with id.
   * DELETE showcaseitems/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ShowcaseItemController
