const Route = use("Route");

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