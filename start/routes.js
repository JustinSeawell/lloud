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

Route.on("/").render("welcome");

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

  // Route.get("songs", "SongController.index").middleware("auth"); // TODO: Paginate this
  // Route.post("songs", "SongController.store").middleware("auth"); // Artist only
  // Route.put("songs/:id", "SongController.update").middleware("auth"); // Artist only
  // Route.get("songs/like", "SongController.like").middleware("auth");
  // Route.delete("songs/:id", "SongController.destroy").middleware("auth"); // Artist only
}).prefix("api/v1");
