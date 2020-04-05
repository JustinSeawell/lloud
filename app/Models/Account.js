"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Account extends Model {
  subscription() {
    return this.hasOne("App/Models/Subscription");
  }
}

module.exports = Account;
