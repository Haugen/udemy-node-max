const mongodb = require('mongodb');

const { getDb } = require('../util/database');

module.exports = class Product {
  constructor(title, imageURL, description, price, id) {
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = Number(price);
    this._id = id ? new mongodb.ObjectID(id) : null;
  }

  save() {
    const db = getDb();
    let dbOperation;

    if (this._id) {
      dbOperation = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOperation = db.collection('products').insertOne(this);
    }

    return dbOperation.catch(error => console.log(error));
  }

  static delete(productId) {
    const db = getDb();
    return db.collection('products').deleteOne({
      _id: new mongodb.ObjectID(productId)
    });
  }

  static getAllProducts() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray();
  }

  static getProductById(productId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectID(productId) })
      .next();
  }
};
