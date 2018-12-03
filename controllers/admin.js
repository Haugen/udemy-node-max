const Product = require('../models/product');
const User = require('../models/user');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    title: 'Add product',
    path: '/admin/add-product',
    editMode: false
  });
};

exports.getEditProduct = (req, res) => {
  Product.findById(req.params.id)
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
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description
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
  Product.findById(req.body._id)
    .then(product => {
      product.title = req.body.title;
      product.price = req.body.price;
      product.imageUrl = req.body.imageUrl;
      product.description = req.body.description;
      return product.save();
    })
    .then(() => {
      req.session.siteMessages.push({
        type: 'success',
        message: 'Product successfully updated.'
      });

      res.redirect('/admin/products');
    });
};

exports.postDeleteProduct = (req, res) => {
  Product.findByIdAndDelete(req.body.productId)
    .then(() => {
      req.session.siteMessages.push({
        type: 'success',
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
  Product.find()
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
