const Route = use("Route");
const prefix = "artists";
const namespace = "Artist";

Route.group(() => {
    Route.get("/apply", "HomeController.home"); // Redirect old apply page
  
    Route.get("/", "HomeController.home").as("artist.home");
    Route.post("users", "UserController.store").as("artist.user.store");
    Route.get("login", "UserController.login").as("artist.user.login");
    Route.post("login", "UserController.authenticate").as("artist.user.auth");
  })
    .prefix(prefix)
    .namespace(namespace);
  
  Route.group(() => {
    Route.get("songs/create", "SongController.create").as("artist.songs.create");
    Route.post("songs/store", "SongController.store").as("artist.songs.store");
    Route.get("songs", "SongController.index").as("artist.songs.index");
  
    Route.get("profile", "ArtistController.show").as("artist.show");
    Route.get("profile/edit", "ArtistController.edit").as("artist.edit");
    Route.post("profile/:id", "ArtistController.update").as("artist.update");
  
    Route.get("logout", "UserController.logout").as("artist.user.logout");
  })
    .prefix(prefix)
    .namespace(namespace)
    .middleware("artist");