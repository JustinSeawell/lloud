"use strict";

const Mail = use("Mail");
const User = (exports = module.exports = {});

User.registered = async (user) => {
  await Mail.send("emails.welcome", user, (message) => {
    message
      .to(user.email)
      .from("noreply@lloudapp.com")
      .subject("Welcome to Lloud");
  });
};

User.recover = async (user, appUrl) => {
  const data = {
    username: user.username,
    resetToken: user.resetPasswordToken,
    appUrl: appUrl,
  };

  await Mail.send("emails.recover-password", data, (message) => {
    message
      .to(user.email)
      .from("noreply@lloudapp.com")
      .subject("Password change request - Lloud");
  });
};

User.passwordWasReset = async (user) => {
  const data = {
    username: user.username,
    email: user.email,
  };

  await Mail.send("emails.password-was-changed", data, (message) => {
    message
      .to(user.email)
      .from("noreply@lloudapp.com")
      .subject("Your password has been changed - Lloud");
  });
};
