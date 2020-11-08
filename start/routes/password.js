const Route = use("Route");

Route.get("auth/reset/:resetToken", "PasswordController.reset")
.middleware("guest")
.as("password.edit");

Route.post("auth/reset/:resetToken", "PasswordController.resetPassword")
.middleware("guest")
.as("password.update");