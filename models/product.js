const fs = require('fs');

const uniqid = require('uniqid');

const getDataFromFile = require('../util/getDataFromFile');

module.exports = class Product {
  constructor(id, title, imageURL, description, price) {
    this.id = id;
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }

  save() {
    getDataFromFile('products.json', (products, filePath) => {
      let newProducts;
      if (this.id) {
        const productIndex = products.findIndex(prod => prod.id === this.id);
        newProducts = [...products];
        newProducts[productIndex] = this;
      } else {
        this.id = uniqid();
        newProducts = products.push(this);
      }

      fs.writeFile(filePath, JSON.stringify(newProducts), error => {
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
