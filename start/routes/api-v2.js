const Route = use("Route");
const prefix = "api/v2";

const v1 = "Api/v1";
const v2 = "Api/v2";

Route.group(() => {
  Route.post("auth/recover", `${v1}/PasswordController.recover`);
  Route.post("login", `${v1}/UserController.login`);
  Route.post("email", `${v1}/UserController.validateEmail`);
  Route.post("username", `${v1}/UserController.validateUsername`);
  Route.post("register", `${v2}/UserController.store`);
})
  .prefix(prefix)
  .middleware("guest");

Route.group(() => {
  Route.get("me", `${v1}/UserController.me`);
  Route.get("accounts/me", `${v2}/AccountController.me`);
  Route.resource("accounts", `${v2}/AccountController`).only(["update"]);
  Route.resource("users", `${v2}/UserController`).only(["show", "update"]);
  Route.resource("user.image-files", `${v2}/UserImageFileController`).only([
    "index",
    "store",
    "destroy",
  ]);
  Route.resource("user.likes", `${v2}/UserLikeController`).only(["index"]);
  Route.get("user/:user_id/likes/profile", `${v2}/UserLikeController.profile`);
  Route.post(
    "user/:user_id/notifications/:id/seen",
    `${v2}/UserNotificationController.seen`
  );
  Route.get(
    "user/:id/notifications/count",
    `${v2}/UserNotificationController.count`
  );
  Route.resource(
    "user.notifications",
    `${v2}/UserNotificationController`
  ).only(["index", "update"]);
  Route.resource("states", `${v2}/StateController`).only(["index"]);
  Route.resource("songs", `${v2}/SongController`).only(["index", "show"]);
  Route.resource("artists", `${v2}/ArtistController`).only(["show"]);
  Route.resource("artist.image-files", `${v2}/ArtistImageFileController`).only([
    "index",
  ]);
  Route.resource("artist.songs", `${v2}/ArtistSongController`).only(["index"]);
  Route.resource("artist.supporters", `${v2}/ArtistSupporterController`).only([
    "index",
  ]);
  Route.resource("likes", `${v2}/LikeController`).only(["store"]);
  Route.resource("plays", `${v2}/PlayController`).only(["store"]);
  Route.resource(
    "offensive-report",
    `${v2}/OffensiveSongReportController`
  ).only(["store"]);
  Route.resource("store-items", `${v1}/StoreItemController`).only([
    "index",
    "show",
  ]);
  Route.resource("store-purchases", `${v1}/StorePurchaseController`).only([
    "store",
  ]);
  Route.resource("activities", `${v2}/ActivityController`).only(["store"]);
  Route.resource("user.apn-tokens", `${v2}/UserApnTokenController`).only([
    "store",
  ]);
  Route.resource("showcase-items", `${v2}/ShowcaseItemController`).only([
    "index",
  ]);
  Route.post("search", `${v2}/SearchController.search`);
})
  .prefix(prefix)
  .middleware("auth");
