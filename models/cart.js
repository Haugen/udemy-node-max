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

  static getCart(callback) {
    getDataFromFile('cart.json', fileData => {
      callback(fileData);
    });
  }
};
