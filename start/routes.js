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

// Website
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

Route.group(() => {
  Route.get("artists/apply", "ArtistApplicationController.create");
  Route.post("artists/apply", "ArtistApplicationController.store");
}).middleware(["guest"]);

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
  Route.post("email", "UserController.validateEmail").middleware("guest");
  Route.post("username", "UserController.validateUsername").middleware("guest");

  Route.post("users", "UserController.store").middleware("guest");
  Route.get("users/likes-balance", "UserController.likesBalance").middleware(
    "auth"
  );
  Route.get("users/points", "UserController.pointsBalance").middleware("auth");
  Route.get("users/:id", "UserController.show").middleware("auth");
  Route.put("users", "UserController.update").middleware("auth");

  Route.get("songs/:page?", "SongController.index").middleware("auth");
  Route.post("songs/:id/like", "LikeController.store").middleware("auth");
  Route.post("songs/:id/offensive-report", "OffensiveSongReportController.store").middleware("auth");

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
