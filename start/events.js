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

Event.on("new::user", "User.registered");
