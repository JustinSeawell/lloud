const Route = use("Route");
const prefix = "api";

Route.group(() => {
  Route.post("login", "UserController.login");
  Route.post("register", "UserController.store");
  Route.post("email", "UserController.validateEmail");
  Route.post("username", "UserController.validateUsername");
})
  .prefix(prefix)
  .middleware("guest");

Route.group(() => {
  Route.get("me", "UserController.me");
  Route.resource("users", "UserController").only(["show", "update"]);
  Route.get("accounts/me", "AccountController.me");
  Route.resource("user.image-files", "UserImageFileController").only([
    "index",
    "store",
    "destroy",
  ]);
  Route.resource("states", "StateController").only(["index"]);
  Route.resource("user.likes", "UserLikeController").only(["index"]);
  Route.resource("songs", "SongController").only(["index", "show"]);
  Route.resource("artists", "ArtistController").only(["show"]);
  Route.resource("artist.image-files", "ArtistImageFileController").only(["index"]);
  Route.resource("artist.songs", "ArtistSongController").only(["index"]);
  Route.resource("artist.supporters", "ArtistSupporterController").only(["index"]);
  Route.resource("likes", "LikeController").only(["store"]);
  Route.resource("plays", "PlayController").only(["store"]);
  Route.resource(
    "offensive-report",
    "OffensiveSongReportController"
  ).only(["store"]);
  Route.resource("store-items", "StoreItemController").only(["index", "show"]);
  Route.resource("store-purchases", "StorePurchaseController").only(
    "store"
  );
  Route.resource("activities", "ActivityController").only(
    "store"
  );
  Route.resource("showcase-items", "ShowcaseItemController").only(
    "index"
  );
  Route.post("search", "SearchController.search");
})
  .prefix(prefix)
  .middleware("auth");
