"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class NotificationSubject extends Model {
  artist() {
    return this.hasOne("App/Models/Artist", "entity_id", "id");
  }

  user() {
    return this.hasOne("App/Models/User", "entity_id", "id");
  }

  song() {
    return this.hasOne("App/Models/Song", "entity_id", "id");
  }

  subject() {
    switch (this.entity_type_id) {
      case 1:
        return this.artist();
      case 2:
        return this.user();
      case 3:
        return this.song();
    }
  }
}

module.exports = NotificationSubject;
