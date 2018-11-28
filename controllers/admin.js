const mongodb = require('mongodb');

const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    title: 'Add product',
    path: '/admin/add-product',
    editMode: false
  });
};

exports.getEditProduct = (req, res) => {
  Product.getProductById(req.params.id)
    .then(product => {
      res.render('admin/edit-product', {
        title: `Edit "${product.title}"`,
        path: '/admin/edit-product',
        product: product,
        editMode: true
      });
    })
    .catch(error => {
      console.log(error);
      req.session.siteMessages.push({
        type: 'warning',
        message: 'Couldn\t find product.'
      });

      res.redirect('/404');
    });
};

exports.postAddProduct = (req, res) => {
  const product = new Product(
    null,
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    Number(req.body.price)
  );
  product.save().then(() => {
    req.session.siteMessages.push({
      type: 'success',
      message: 'Product successfully added.'
    });

    res.redirect('/');
  });
};

exports.postEditProduct = (req, res) => {
  const product = new Product(
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    Number(req.body.price),
    new mongodb.ObjectID(req.body._id)
  );
  product.save().then(() => {
    req.session.siteMessages.push({
      type: 'success',
      message: 'Product successfully updated.'
    });

    res.redirect('/admin/products');
  });
};

exports.postDeleteProduct = (req, res) => {
  Product.delete(req.body.productId, error => {
    if (error) {
      req.session.siteMessages.push({
        type: 'warning',
        message: error.message
      });
    } else {
      req.session.siteMessages.push({
        type: 'success',
        message: 'Product deleted.'
      });
    }
    res.redirect('/admin/products');
  });
};

exports.getAdminProducts = (req, res) => {
  Product.getAllProducts()
    .then(products => {
      res.render('admin/admin-product-list', {
        title: 'Product list',
        path: '/admin/products',
        products: products
      });
    })
    .catch(error => {
      console.log(error);
    });
};
