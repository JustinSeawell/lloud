"use strict";

class HomeController {
  async home({ auth, view }) {
    try {
      await auth.authenticator("session").check();
    } catch (e) {
      return view.render("admin.login");
    }

    const user = await auth.authenticator("session").getUser();

    return view.render("admin.dashboard", { user });
  }
}

module.exports = HomeController;
