const { validationResult } = require('express-validator/check');

const Product = require('../models/product');
const User = require('../models/user');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    title: 'Add product',
    path: '/admin/add-product',
    editMode: false,
    oldInput: null
  });
};

exports.getEditProduct = (req, res) => {
  Product.findById(req.params.id)
    .then(product => {
      res.render('admin/edit-product', {
        title: `Edit "${product.title}"`,
        path: '/admin/edit-product',
        product: product,
        editMode: true,
        oldInput: null
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      title: 'Add product',
      path: '/admin/add-product',
      siteMessages: errors.array(),
      editMode: false,
      oldInput: {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price
      }
    });
  }

  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    userId: req.user._id
  });
  product
    .save()
    .then(() => {
      req.session.siteMessages.push({
        type: 'success',
        message: 'Product successfully added.'
      });

      res.redirect('/admin/products');
    })
    .catch(error => {
      console.log(error);
    });
};

exports.postEditProduct = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      title: 'Edit product',
      path: '/admin/edit-product',
      siteMessages: errors.array(),
      editMode: false,
      oldInput: {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price
      }
    });
  }

  Product.findById(req.body._id).then(product => {
    if (product.userId.toString() !== req.user._id.toString()) {
      req.session.siteMessages.push({
        type: 'danger',
        message: 'You are not authorized to edit this product.'
      });

      return res.redirect('/');
    }
    product.title = req.body.title;
    product.price = req.body.price;
    product.imageUrl = req.body.imageUrl;
    product.description = req.body.description;
    product.save().then(() => {
      req.session.siteMessages.push({
        type: 'success',
        message: 'Product successfully updated.'
      });

      res.redirect('/admin/products');
    });
  });
};

exports.postDeleteProduct = (req, res) => {
  Product.deleteOne({ _id: req.body.productId, userId: req.user._id })
    .then(() => {
      req.session.siteMessages.push({
        type: 'warning',
        message: 'Product deleted.'
      });
      res.redirect('/admin/products');
    })
    .catch(error => {
      console.log(error);
      req.session.siteMessages.push({
        type: 'warning',
        message: error.message
      });
    });
};

exports.getAdminProducts = (req, res) => {
  Product.find({ userId: req.user._id })
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
