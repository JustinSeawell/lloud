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
        .from(Env.get("FROM_EMAIL_ADDRESS"), Env.get("FROM_EMAIL_NAME"))
        .subject("Lloud: Artist Application Results");
    }
  );
};

ArtistApplication.approved = async (application) => {
  await Mail.send(
    "emails.artist-application-approved",
    application,
    (message) => {
      message
        .to(application.email)
        .from(Env.get("FROM_EMAIL_ADDRESS"), Env.get("FROM_EMAIL_NAME"))
        .subject("Lloud: Artist Application Results");
    }
  );
};
