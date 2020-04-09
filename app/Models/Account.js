"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Account extends Model {
  subscriptions() {
    return this.hasMany("App/Models/Subscription");
  }

  activeSubscription() {
    return this.hasOne("App/Models/Subscription").where("is_active", true);
  }

  accountType() {
    return this.hasOne("App/Models/AccountType");
  }
}

module.exports = Account;
