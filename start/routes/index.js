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

require("./website");
require("./password");
require("./api-v1");

// ======================================
// ADMIN PORTAL
// ======================================
Route.group(() => {
  Route.on("login").render("admin.login");
  Route.post("login", "UserController.login").as("admin.login");
})
  .prefix("admin")
  .namespace("Admin");

Route.group(() => {
  Route.get("/", "HomeController.home").as("admin.home");
  Route.get("songs/page/:page?", "SongController.index").as("admin.songs");
  Route.get("songs/:id", "SongController.show").as("admin.songs.show");
  Route.post("songs/:id", "SongController.update").as("admin.songs.update");

  Route.get(
    "artist-applications/:page?",
    "ArtistApplicationController.index"
  ).as("admin.artist-apps");
  Route.get(
    "artist-applications/show/:id",
    "ArtistApplicationController.show"
  ).as("admin.artist-app");
  Route.post(
    "artist-applications/:id/result",
    "ArtistApplicationController.update"
  ).as("admin.artist-app.update");
})
  .prefix("admin")
  .middleware("admin")
  .namespace("Admin");

// ======================================
// ARTIST PORTAL
// ======================================
Route.group(() => {
  Route.get("/apply", "HomeController.home"); // Redirect old apply page

  Route.get("/", "HomeController.home").as("artist.home");
  Route.post("users", "UserController.store").as("artist.user.store");
  Route.get("login", "UserController.login").as("artist.user.login");
  Route.post("login", "UserController.authenticate").as("artist.user.auth");
})
  .namespace("Artist")
  .prefix("artists");

Route.group(() => {
  Route.get("songs/create", "SongController.create").as("artist.songs.create");
  Route.post("songs/store", "SongController.store").as("artist.songs.store");
  Route.get("songs", "SongController.index").as("artist.songs.index");

  Route.get("profile", "ArtistController.show").as("artist.show");
  Route.get("profile/edit", "ArtistController.edit").as("artist.edit");
  Route.post("profile/:id", "ArtistController.update").as("artist.update");

  Route.get("logout", "UserController.logout").as("artist.user.logout");
})
  .namespace("Artist")
  .prefix("artists")
  .middleware("artist");
