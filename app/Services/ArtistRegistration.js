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
       * Create the artist account, and submit
       * their first song via the application data.
       */
      const artist = await Artist.create(
        {
          name: artistApplication.name,
          email: artistApplication.email,
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

      Event.fire("artist_application::approved", artistApplication.toJSON());
    } catch (err) {
      console.log(err);
      await trx.rollback();
      throw Error("Artist account registration failed");
    }
  }
}

module.exports = ArtistRegistration;
