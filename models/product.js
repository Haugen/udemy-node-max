const fs = require('fs');

const mongodb = require('mongodb');

const getDataFromFile = require('../util/getDataFromFile');
const Cart = require('./cart');
const { getDb } = require('../util/database');

module.exports = class Product {
  constructor(title, imageURL, description, price) {
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }

  save() {
    const db = getDb();

    return db
      .collection('products')
      .insertOne(this)
      .catch(error => console.log(error));
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
