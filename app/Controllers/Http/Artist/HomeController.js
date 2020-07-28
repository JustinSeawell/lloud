"use strict";

const Artist = use("App/Models/Artist");

class HomeController {
  async home({ auth, view }) {
    try {
      await auth.authenticator("session").check();
    } catch (e) {
      return view.render("artist.users.create");
    }

    const user = await auth.authenticator("session").getUser();
    const acct = await user.account().first();
    const artist = await Artist.findBy("account_id", acct.id);

    const total = await artist.getTotalLikes();

    return view.render("artist.dashboard", { artist, likes: total.toString() });
  }
}

module.exports = HomeController;
