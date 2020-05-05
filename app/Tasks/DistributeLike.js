"use strict";

const moment = require("moment");

const Task = use("Task");
const Database = use("Database");
const Account = use("App/Models/Account");
const Subscription = use("App/Models/Subscription");

class DistributeLike extends Task {
  static get schedule() {
    return "0 */1 * * *"; // Once an hour
  }

  async handle() {
    console.log("Running Task: DistributeLike");

    const now = moment();

    const results = await Subscription.query()
      .with("account")
      .with("plan")
      .whereRaw(
        "WEEKDAY(started_at) = ? AND HOUR(started_at) = ? AND ended_at > ?",
        [now.weekday(), now.hour(), now.format("YYYY-MM-DD HH:mm:ss")]
      )
      .fetch();

    results.rows.forEach(async (subscription) => {
      const acct = subscription.getRelated("account");
      const plan = subscription.getRelated("plan");

      acct.likes_balance = plan.likes_per_month / 4; // TODO: Update this to a weekly balance
      await acct.save();
    });
  }
}

module.exports = DistributeLike;
