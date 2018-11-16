const fs = require('fs');
const path = require('path');

const uniqid = require('uniqid');

const rootPath = require('../util/path');

const getProductsFromFile = callback => {
  const filePath = path.join(rootPath, 'data', 'products.json');
  fs.readFile(filePath, (error, fileData) => {
    if (!error) {
      callback(JSON.parse(fileData), filePath);
    } else {
      callback([], filePath);
    }
  });
};

module.exports = class Product {
  constructor(title, imageURL, description, price) {
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = uniqid();
    getProductsFromFile((products, filePath) => {
      products.push(this);
      fs.writeFile(filePath, JSON.stringify(products), error => {
        if (error) {
          console.log(error);
        }
      });
    });
  }

  static getAllProducts(callback) {
    getProductsFromFile(callback);
  }

  static getProductById(productId, callback) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === productId);
      callback(product);
    });
  }
};
