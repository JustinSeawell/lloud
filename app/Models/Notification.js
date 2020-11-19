"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Notification extends Model {
  subjects() {
    return this.hasMany("App/Models/NotificationSubject");
  }
}

module.exports = Notification;
