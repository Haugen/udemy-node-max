const fs = require('fs');

const uniqid = require('uniqid');

const getDataFromFile = require('../util/getDataFromFile');
const Cart = require('./cart');

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
        products.push(this);
        newProducts = products;
      }

      fs.writeFile(filePath, JSON.stringify(newProducts), error => {
        if (error) {
          console.log(error);
        }
      });
    });
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
