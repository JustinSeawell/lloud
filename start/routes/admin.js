const Route = use("Route");
const prefix = "admin";
const namespace = "Admin";

Route.group(() => {
    Route.on("login").render("admin.login");
    Route.post("login", "UserController.login").as("admin.login");
  })
    .prefix(prefix)
    .namespace(namespace);
  
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
    .prefix(prefix)
    .namespace(namespace)
    .middleware("admin");