'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const OffensiveSongReport = use("App/Models/OffensiveSongReport");

/**
 * Resourceful controller for interacting with offensivesongreports
 */
class OffensiveSongReportController {
  /**
   * Show a list of all offensivesongreports.
   * GET offensivesongreports
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new offensivesongreport.
   * GET offensivesongreports/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new offensivesongreport.
   * POST offensivesongreports
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const songId = request.input('song_id');

    const reportData = {
      user_id: auth.user.id,
      song_id: songId
    };

    const report = await OffensiveSongReport.create(reportData);
    return response.created({ success: true, data: report });
    
  }

  /**
   * Display a single offensivesongreport.
   * GET offensivesongreports/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing offensivesongreport.
   * GET offensivesongreports/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update offensivesongreport details.
   * PUT or PATCH offensivesongreports/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a offensivesongreport with id.
   * DELETE offensivesongreports/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = OffensiveSongReportController
