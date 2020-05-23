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
    const zeroBasedWeekday = now.weekday() - 1; // Weekday function in MySQL is zero based, but Moment JS starts with 1

    const results = await Subscription.query()
      .with("account")
      .with("plan")
      .where("is_active", 1)
      .whereRaw(
        "WEEKDAY(started_at) = ? AND HOUR(started_at) = ? AND (ended_at > ? OR ended_at IS NULL)",
        [zeroBasedWeekday, now.hour(), now.format("YYYY-MM-DD HH:mm:ss")]
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
