"use strict";

const moment = require("moment");

const Database = use("Database");
const Event = use("Event");

const Service = use("App/Services");
const Account = use("App/Models/Account");
const Subscription = use("App/Models/Subscription");
const User = use("App/Models/User");

class UserRegistration extends Service {
  static async registerListenerDefaultAccount(userData) {
    const trx = await Database.beginTransaction();

    try {
      const user = await User.create(userData, trx);

      const account = await Account.create(
        {
          user_id: user.id,
          account_type_id: 2, // Listener
          likes_balance: 20,
        },
        trx
      );

      const now = moment();
      const freeSubscriptionStart = now.format("YYYY-MM-DD HH:mm:ss");
      const freeSubscriptionEnd = now
        .add(30, "days")
        .format("YYYY-MM-DD HH:mm:ss");
      const subscription = await Subscription.create(
        {
          account_id: account.id,
          plan_id: 2, // Freemium
          started_at: freeSubscriptionStart,
          ended_at: freeSubscriptionEnd,
          is_active: true,
        },
        trx
      );

      await trx.commit();

      Event.fire("user::new", user);

      return user;
    } catch (err) {
      await trx.rollback();
      throw Error("Listener user default registration failed");
    }
  }

  static async registerAdminAccount() {}
}

module.exports = UserRegistration;
