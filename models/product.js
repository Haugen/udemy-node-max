const fs = require('fs');
const path = require('path');

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
  constructor(title) {
    this.title = title;
  }

  save() {
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
};
