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

exports.getProduct = (req, res) => {
  Product.getProductById(req.params.productId, product => {
    if (product) {
      res.render('shop/product-detail', {
        title: product.title,
        path: '/products',
        product: product
      });
    } else {
      res.redirect('/404');
    }
  });
};

exports.getCart = (req, res) => {
  res.render('shop/cart', {
    title: 'Shopping Cart',
    path: '/cart'
  });
};

exports.postCart = (req, res) => {
  console.log(req.body.productId);
  res.redirect('/cart');
};

exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    title: 'Orders',
    path: '/orders'
  });
};
