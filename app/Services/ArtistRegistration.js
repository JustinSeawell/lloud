"use strict";

const moment = require("moment");

const Database = use("Database");
// const Event = use("Event");

const Service = use("App/Services");
const Artist = use("App/Models/Artist");
const Account = use("App/Models/Account");
const User = use("App/Models/User");
const Subscription = use("App/Models/Subscription");

class ArtistRegistration extends Service {
  static async registerArtist(userData) {
    const trx = await Database.beginTransaction();

    try {
      const newUser = await User.create(
        {
          email: userData.email,
          password: userData.password,
          username: userData.artist_name,
        },
        trx
      );

      const artistAccount = await Account.create(
        {
          user_id: newUser.id,
          account_type_id: 3,
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
          account_id: artistAccount.id,
          plan_id: 2, // Freemium
          started_at: freeSubscriptionStart,
          ended_at: freeSubscriptionEnd,
          is_active: true,
        },
        trx
      );

      const artist = await Artist.create(
        {
          name: userData.artist_name,
          email: userData.email,
          account_id: artistAccount.id,
        },
        trx
      );

      await trx.commit();
    } catch (err) {
      console.log(err);
      await trx.rollback();
      throw Error("Artist account registration failed");
    }
  }
}

module.exports = ArtistRegistration;
