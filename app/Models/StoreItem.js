"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class StoreItem extends Model {
  imageFile() {
    return this.belongsTo("App/Models/ImageFile");
  }
}

module.exports = StoreItem;
