"use strict";

/*
|--------------------------------------------------------------------------
| Events
|--------------------------------------------------------------------------
|
| Pair your event namespaces with event listeners here.
|
| A complete guide on events is available here.
| https://adonisjs.com/docs/4.1/events
|
*/

const Event = use("Event");

Event.on("user::new", "User.registered");
Event.on("user::recover_password", "User.recover");
Event.on("user::password_was_reset", "User.passwordWasReset");

Event.on("artist_application::denied", "ArtistApplication.denied");
Event.on("artist_application::approved", "ArtistApplication.approved");

Event.on("like::new", "Like.created");
