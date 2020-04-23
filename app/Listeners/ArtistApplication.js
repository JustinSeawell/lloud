"use strict";

const Env = use("Env");
const Mail = use("Mail");
const ArtistApplication = (exports = module.exports = {});

ArtistApplication.denied = async (application) => {
  await Mail.send(
    "emails.artist-application-denied",
    application,
    (message) => {
      message
        .to(application.email)
        .from("noreply@lloudapp.com")
        .subject("Lloud: Artist Application Results");
    }
  );
};

ArtistApplication.approved = async (application, user) => {
  const data = {
    name: application.name,
    resetToken: user.resetPasswordToken,
    appUrl: Env.get("APP_URL"),
  };

  await Mail.send("emails.artist-application-approved", data, (message) => {
    message
      .to(application.email)
      .from("noreply@lloudapp.com")
      .subject("Lloud: Artist Application Results");
  });
};
