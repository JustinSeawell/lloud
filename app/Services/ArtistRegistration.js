"use strict";

const crypto = require("crypto");

const Database = use("Database");
const Event = use("Event");

const Service = use("App/Services");
const Account = use("App/Models/Account");
const Subscription = use("App/Models/Subscription");
const User = use("App/Models/User");
const Artist = use("App/Models/Artist");
const Song = use("App/Models/Song");
const ArtistSong = use("App/Models/ArtistSong");

class ArtistRegistration extends Service {
  static async registerArtist(artistApplication) {
    const trx = await Database.beginTransaction();

    try {
      /**
       * Setup a user account for the artist so they can login
       */
      const user = await User.create(
        {
          username: artistApplication.name,
          email: artistApplication.email,
          password: crypto.randomBytes(20).toString("hex"), // tmp password
        },
        trx
      );
      user.generateDayLongPasswordReset();
      user.save();

      // TODO: Redundant code.. clean this up
      const acct = await Account.create(
        {
          user_id: user.id,
          account_type_id: 3, // Artist
          likes_balance: 20,
        },
        trx
      );

      const subscription = await Subscription.create(
        {
          account_id: acct.id,
          plan_id: 3, // TODO: Create artist plan
          started_at: artistApplication.approved_at,
        },
        trx
      );

      /**
       * Create the artist account, and submit
       * their first song via the application data.
       */
      const artist = await Artist.create(
        {
          name: artistApplication.name,
          city: artistApplication.city,
          state: artistApplication.state,
          zipcode: artistApplication.zipcode,
          country: artistApplication.country,
          description: artistApplication.description,
        },
        trx
      );

      const song = await Song.create(
        {
          title: artistApplication.song_title,
          audio_file_id: artistApplication.audio_file_id,
          image_file_id: artistApplication.image_file_id,
        },
        trx
      );

      await ArtistSong.create(
        {
          artist_id: artist.id,
          song_id: song.id,
        },
        trx
      );

      await trx.commit();

      Event.fire(
        "artist_application::approved",
        artistApplication.toJSON(),
        user
      );
    } catch (err) {
      console.log(err);
      await trx.rollback();
      throw Error("Artist account registration failed");
    }
  }
}

module.exports = ArtistRegistration;
