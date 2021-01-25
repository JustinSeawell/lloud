"use strict";

const Artist = use("App/Models/Artist");
const Song = use("App/Models/Song");
const User = use("App/Models/User");
const Like = use("App/Models/Like");
const SearchRequest = use("App/Models/SearchRequest");

class SearchController {
  async search({ request, response, auth }) {
    const { searchTerm } = request.only(["searchTerm"]);

    // TODO: Beef this up w pagination at some point
    // const page = request.input("page") || 1;

    SearchRequest.create({
      user_id: auth.user.id,
      search_term: searchTerm,
    });

    let artists = await Artist.query()
      .where("name", "LIKE", "%" + searchTerm + "%")
      .limit(5)
      .fetch();
    artists = await Promise.all(
      artists.rows.map(async (artist) => {
        const firstSong = await artist.songs().with("imageFile").first();

        if (!firstSong) {
          return artist;
        }

        artist.imageFile = firstSong.getRelated("imageFile");

        const songIds = await artist.getSongIds();
        artist.likes = await Like.query()
          .whereIn("song_id", songIds)
          .getCount();

        return artist;
      })
    );

    const songs = await Song.query()
      .with("artists")
      .with("imageFile")
      .where("title", "LIKE", "%" + searchTerm + "%")
      .whereNull("deleted_at")
      .whereNotNull("approved_at")
      .limit(5)
      .fetch();

    const users = await User.query()
      .with("profileImg")
      .where("username", "LIKE", "%" + searchTerm + "%")
      .setHidden([
        "email",
        "address1",
        "address2",
        "city",
        "state",
        "zipcode",
        "country",
        "resetPasswordToken",
        "resetPasswordExpires",
        "password",
        "created_at",
        "updated_at",
      ])
      .whereNull("deleted_at")
      .limit(5)
      .fetch();

    return response.ok({
      status: "success",
      data: { artists, songs },
    });
  }
}

module.exports = SearchController;
