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

// ======================================
// PUBLIC WEBSITE
// ======================================
Route.on("/").render("site.home");
Route.on("/what-is-lloud").render("site.what-is-lloud");
Route.on("/help").render("site.help").as("help-center");
Route.on("/help/like-a-song")
  .render("site.help.like-a-song")
  .as("help-center.like-a-song");
Route.on("/help/earn-points")
  .render("site.help.earn-points")
  .as("help-center.earn-points");
Route.on("/help/purchase-rewards")
  .render("site.help.purchase-rewards")
  .as("help-center.purchase-rewards");
Route.on("/help/change-your-password")
  .render("site.help.change-your-password")
  .as("help-center.change-your-password");
Route.on("/help/create-your-account")
  .render("site.help.create-your-account")
  .as("help-center.create-your-account");
Route.on("/about").render("site.about").as("about");
Route.on("/privacy").render("site.privacy").as("privacy");
Route.on("/terms").render("site.terms").as("terms");
Route.get("/contact", "ContactFormController.create").as("contact");
Route.post("/contact", "ContactFormController.store").as("contact.store");

// ======================================
// PASSWORD RECOVERY
// ======================================
Route.get("auth/reset/:resetToken", "PasswordController.reset")
  .middleware("guest")
  .as("password.edit");

Route.post("auth/reset/:resetToken", "PasswordController.resetPassword")
  .middleware("guest")
  .as("password.update");

// ======================================
// WEB API
// ======================================
Route.group(() => {
  Route.post("auth/recover", "PasswordController.recover").middleware("guest");

  Route.post("login", "UserController.login").middleware("guest");
  Route.get("me", "UserController.me").middleware("auth");
  Route.post("email", "UserController.validateEmail").middleware("guest");
  Route.post("username", "UserController.validateUsername").middleware("guest");

  Route.get("accounts/me", "AccountController.me").middleware("auth");

  Route.post("users", "UserController.store").middleware("guest");
  Route.get("users/likes-balance", "UserController.likesBalance").middleware(
    "auth"
  );
  Route.get("users/points", "UserController.pointsBalance").middleware("auth");
  Route.get("users/:id", "UserController.show").middleware("auth");
  Route.put("users", "UserController.update").middleware("auth");

  Route.get("songs/:page?", "SongController.index").middleware("auth");
  Route.post("songs/:id/like", "LikeController.store").middleware("auth");
  Route.post("songs/:id/play", "PlayController.store").middleware("auth");
  Route.post(
    "songs/:id/offensive-report",
    "OffensiveSongReportController.store"
  ).middleware("auth");

  Route.get("artists/:id", "ArtistController.show").middleware("auth");

  Route.get("likes", "LikeController.index").middleware("auth");

  Route.get("store-items/:page?", "StoreItemController.index").middleware(
    "auth"
  );
  Route.get("store-items/show/:id", "StoreItemController.show").middleware(
    "auth"
  );

  Route.post(
    "store-items/purchase",
    "StorePurchaseController.store"
  ).middleware("auth");

  Route.post(
    "subscriptions/upgrade",
    "SubscriptionController.upgrade"
  ).middleware("auth");

  Route.post(
    "purchase-updates/verify",
    "PurchaseReceiptController.verify"
  ).middleware("auth");

  Route.post("image-files/store", "ImageFileController.store");
  Route.post("audio-files/store", "AudioFileController.store");
}).prefix("api/v1");

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
