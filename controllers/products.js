const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    title: 'Add product',
    path: '/admin/add-product'
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect('/');
};

exports.getFront = (req, res) => {
  Product.getAllProducts(products => {
    res.render('shop/index', {
      title: 'Welcome to my shop',
      products: products,
      path: '/'
    });
  });
};

exports.getProducts = (req, res) => {
  Product.getAllProducts(products => {
    res.render('shop/product-list', {
      title: 'Product list',
      products: products,
      path: '/products'
    });
  });
};

exports.getAdminProducts = (req, res) => {
  Product.getAllProducts(products => {
    res.render('admin/admin-product-list', {
      title: 'Product list',
      products: products,
      path: '/admin/products'
    });
  });
};

exports.getCart = (req, res) => {
  res.render('shop/cart', {
    title: 'Shopping Cart',
    path: '/cart'
  });
};
