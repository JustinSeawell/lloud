"use strict";

/*
|--------------------------------------------------------------------------
| NotificationTypeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const NotificationType = use("App/Models/NotificationType");

class NotificationTypeSeeder {
  async run() {
    const types = [{ name: "received point for like" }];

    await NotificationType.createMany(types);
  }
}

module.exports = NotificationTypeSeeder;
