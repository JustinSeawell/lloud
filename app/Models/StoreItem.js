"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class StoreItem extends Model {
  imageFile() {
    return this.belongsTo("App/Models/ImageFile");
  }

  type() {
    return this.belongsTo("App/Models/StoreItemType");
  }

  size(str) {
    return this.hasMany("App/Models/StoreItemSize").where("size", str);
  }

  sizes() {
    return this.hasMany("App/Models/StoreItemSize");
  }

  availableSizes() {
    return this.hasMany("App/Models/StoreItemSize").where("qty", ">", 0);
  }
}

module.exports = StoreItem;
