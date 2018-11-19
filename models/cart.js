const fs = require('fs');

const getDataFromFile = require('../util/getDataFromFile');

module.exports = class Cart {
  static addProduct(product) {
    getDataFromFile('cart.json', (fileData, filePath) => {
      let cartProduct = fileData.products.find(prod => prod.id === product.id);
      if (cartProduct) {
        // If the product is already in the cart, increment quantity.
        cartProduct.quantity++;
      } else {
        // If the product is not in the cart, add it with quantity 1.
        cartProduct = {
          ...product,
          quantity: 1
        };
        fileData.products.push(cartProduct);
      }

      // Increase the total price.
      fileData.totalPrice += product.price;

      // Write the new updated cart to file.
      fs.writeFile(filePath, JSON.stringify(fileData), error => {
        if (error) {
          console.log(error);
        }
      });
    });
  }

  static removeProduct(id) {
    getDataFromFile('cart.json', (fileData, filePath) => {
      const product = fileData.products.find(prod => prod.id === id);
      if (product) {
        fileData.totalPrice -= product.price * product.quantity;
        const newProducts = fileData.products.filter(prod => prod.id !== id);
        fileData.products = newProducts;

        fs.writeFile(filePath, JSON.stringify(fileData), error => {
          if (error) {
            console.log(error);
          }
        });
      }
    });
  }

  static adjustQuantity(id, operation, callback) {
    getDataFromFile('cart.json', (fileData, filePath) => {
      const productIndex = fileData.products.findIndex(prod => prod.id === id);

      if (productIndex !== -1) {
        if (operation === 'increase') {
          fileData.totalPrice += fileData.products[productIndex].price;
          fileData.products[productIndex].quantity++;
        } else if (operation === 'decrease') {
          if (fileData.products[productIndex].quantity <= 1) {
            this.removeProduct(fileData.products[productIndex].id);
          } else {
            fileData.totalPrice -= fileData.products[productIndex].price;
            fileData.products[productIndex].quantity--;
          }
        }

        fs.writeFile(filePath, JSON.stringify(fileData), error => {
          if (error) {
            callback(error);
          } else {
            callback();
          }
        });
      }
    });
  }

  static decrementProduct(id) {}

  static getCart(callback) {
    getDataFromFile('cart.json', fileData => {
      callback(fileData);
    });
  }
};
