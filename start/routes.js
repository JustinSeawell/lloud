"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

// Artist application
Route.get("artists/apply", "ArtistApplicationController.create").middleware(
  "guest"
);
Route.post("artists/apply", "ArtistApplicationController.store").middleware(
  "guest"
);

// Password Recovery
Route.get("auth/reset/:resetToken", "PasswordController.reset")
  .middleware("guest")
  .as("password.edit");

Route.post("auth/reset/:resetToken", "PasswordController.resetPassword")
  .middleware("guest")
  .as("password.update");

// API
Route.group(() => {
  Route.post("auth/recover", "PasswordController.recover").middleware("guest");

  Route.post("login", "UserController.login").middleware("guest");
  Route.get("me", "UserController.me").middleware("auth");

  Route.post("users", "UserController.store").middleware("guest");
  Route.get("users/:id", "UserController.show").middleware("auth");

  Route.get("songs/:page?", "SongController.index").middleware("auth");
  Route.post("songs/:id/like", "LikeController.store").middleware("auth");

  Route.get("likes", "LikeController.index").middleware("auth");
}).prefix("api/v1");

// Admin
Route.group(() => {
  Route.on("login").render("admin.login");
  Route.post("login", "UserController.adminLogin")
    .middleware("guest")
    .as("admin.login");
  Route.get("artist-applications/:page?", "ArtistApplicationController.index")
    .middleware("admin")
    .as("admin.artist-apps");
  Route.get("artist-applications/show/:id", "ArtistApplicationController.show")
    .middleware("admin")
    .as("admin.artist-app");
  Route.post(
    "artist-applications/:id/result",
    "ArtistApplicationController.update"
  )
    .middleware("admin")
    .as("admin.artist-app.update");
}).prefix("admin");
