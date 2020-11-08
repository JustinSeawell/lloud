"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const moment = require("moment");

const Database = use("Database");
const { validate } = use("Validator");
const Like = use("App/Models/Like");
const Account = use("App/Models/Account");

/**
 * Resourceful controller for interacting with likes
 */
class LikeController {
  /**
   * Show a list of all likes.
   * GET likes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    const userId = auth.user.id;

    const results = await Like.query()
      .with("song.artists")
      .with("song.audioFile")
      .with("song.imageFile")
      .with("song.likes")
      .orderBy("created_at", "desc")
      .where({ user_id: userId })
      .fetch();

    results.rows = results.rows.map((like) => {
      const likeObj = like.toJSON();
      const thisUserLikedAt = likeObj.created_at;

      like.pointsEarned = 0;
      likeObj.song.likes.forEach((likeByOtherUser) => {
        if (moment(thisUserLikedAt).isBefore(likeByOtherUser.created_at)) {
          like.pointsEarned++;
        }
      });

      return like;
    });

    response.send({ success: true, data: results });
  }

  /**
   * Render a form to be used for creating a new like.
   * GET likes/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new like.
   * POST likes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, params, auth }) {
    const likeData = {
      song_id: params.id,
      user_id: auth.user.id,
    };

    const acct = await Account.findBy("user_id", auth.user.id);
    if (acct.likes_balance <= 0) {
      return response.ok({
        success: false,
        message: "User is out of likes",
      });
    }

    // Make sure this user hasn't already liked this song
    const likeExists = await Like.query().where(likeData).fetch();

    if (likeExists.rows.length > 0) {
      return response.ok({
        success: false,
        message: "User cannot like the same song twice",
      });
    }

    const otherUsersWhoLikedSong = Database.from("likes")
      .where({ song_id: params.id })
      .select("user_id");

    if (!auth.user.is_fake) {
      await Account.query()
        .whereIn("user_id", otherUsersWhoLikedSong)
        .increment("points_balance", 1);
    }

    const like = await Like.create(likeData);

    acct.likes_balance--;
    await acct.save();

    return response.created({ success: true, data: like });
  }

  /**
   * Display a single like.
   * GET likes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing like.
   * GET likes/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update like details.
   * PUT or PATCH likes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a like with id.
   * DELETE likes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = LikeController;
