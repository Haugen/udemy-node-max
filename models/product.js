const fs = require('fs');

const mongodb = require('mongodb');

const getDataFromFile = require('../util/getDataFromFile');
const Cart = require('./cart');
const { getDb } = require('../util/database');

module.exports = class Product {
  constructor(title, imageURL, description, price, id) {
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
    this._id = id;
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

  static delete(productId, callback) {
    getDataFromFile('products.json', (products, filePath) => {
      const indexToDelete = products.findIndex(prod => prod.id === productId);
      if (indexToDelete === -1)
        return callback({ message: 'Product not found.' });

      products.splice(indexToDelete, 1);
      Cart.removeProduct(productId);

      fs.writeFile(filePath, JSON.stringify(products), error => {
        if (error) {
          callback(error);
        } else {
          callback();
        }
      });
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
