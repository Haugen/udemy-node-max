const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    title: 'Add product',
    path: '/admin/add-product'
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product(
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );
  product.save();
  res.redirect('/');
};

exports.getAdminProducts = (req, res) => {
  Product.getAllProducts(products => {
    res.render('admin/admin-product-list', {
      title: 'Product list',
      path: '/admin/products',
      products: products
    });
  });
};
