const fs = require('fs');

const uniqid = require('uniqid');

const getDataFromFile = require('../util/getDataFromFile');

module.exports = class Product {
  constructor(title, imageURL, description, price) {
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = uniqid();
    getDataFromFile('products.json', (products, filePath) => {
      products.push(this);
      fs.writeFile(filePath, JSON.stringify(products), error => {
        if (error) {
          console.log(error);
        }
      });
    });
  }

  static getAllProducts(callback) {
    getDataFromFile('products.json', callback);
  }

  static getProductById(productId, callback) {
    getDataFromFile('products.json', products => {
      const product = products.find(p => p.id === productId);
      callback(product);
    });
  }
};
