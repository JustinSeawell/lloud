const Route = use("Route");

Route.get("auth/reset/:resetToken", "PasswordController.reset")
  .middleware("guest")
  .namespace("Api/v1")
  .as("password.edit");

Route.post("auth/reset/:resetToken", "PasswordController.resetPassword")
  .middleware("guest")
  .namespace("Api/v1")
  .as("password.update");
