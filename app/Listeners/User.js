"use strict";

const User = (exports = module.exports = {});
const Mail = use("Mail");

User.registered = async (user) => {
  await Mail.send("emails.welcome", user, (message) => {
    message
      .to(user.email)
      .from("noreply@lloudapp.com")
      .subject("Welcome to Lloud");
  });
};
