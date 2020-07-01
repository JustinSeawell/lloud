"use strict";

const moment = require("moment");

const Task = use("Task");
const Database = use("Database");
const Account = use("App/Models/Account");
const Subscription = use("App/Models/Subscription");

class DistributeLike extends Task {
  static get schedule() {
    return "1 * 1 * *"; // Minute 1 on 1st day of the month
  }

  async handle() {
    console.log("Running Task: DistributeLike");

    const now = moment();

    const results = await Subscription.query()
      .with("account")
      .with("plan")
      .where("is_active", 1)
      .where(function () {
        this.whereNull("ended_at").orWhere(
          "ended_at",
          ">=",
          now.format("YYYY-MM-DD HH:mm:ss")
        );
      })
      .fetch();

    results.rows.forEach(async (subscription) => {
      const acct = subscription.getRelated("account");
      const plan = subscription.getRelated("plan");

      acct.likes_balance += plan.likes_per_month;
      await acct.save();
    });
  }
}

module.exports = DistributeLike;
