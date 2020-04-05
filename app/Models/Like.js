"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Like extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeCreate", "LikeHook.distributePoints");
  }
}

module.exports = Like;
