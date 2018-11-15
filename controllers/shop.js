const Product = require('../models/product');

exports.getFront = (req, res) => {
  Product.getAllProducts(products => {
    res.render('shop/index', {
      title: 'Welcome to my shop',
      path: '/',
      products: products
    });
  });
};

exports.getProducts = (req, res) => {
  Product.getAllProducts(products => {
    res.render('shop/product-list', {
      title: 'Product list',
      path: '/products',
      products: products
    });
  });
};

exports.getCart = (req, res) => {
  res.render('shop/cart', {
    title: 'Shopping Cart',
    path: '/cart'
  });
};
