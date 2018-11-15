const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('pages/add-product', {
    title: 'Add product',
    path: '/admin/add'
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect('/');
};

exports.getFrontpage = (req, res) => {
  Product.getAllProducts(products => {
    res.render('pages/shop', {
      title: 'Welcome to my shop',
      products: products,
      path: '/'
    });
  });
};
