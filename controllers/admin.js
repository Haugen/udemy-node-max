const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    title: 'Add product',
    path: '/admin/add-product',
    editMode: false
  });
};

exports.getEditProduct = (req, res) => {
  Product.getProductById(req.params.id, product => {
    if (product) {
      res.render('admin/edit-product', {
        title: `Edit "${product.title}"`,
        path: '/admin/edit-product',
        product: product,
        editMode: true
      });
    } else {
      res.redirect('/404');
    }
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
  product.save();
  res.redirect('/');
};

exports.postEditProduct = (req, res) => {
  const product = new Product(
    req.body.id,
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    Number(req.body.price)
  );
  product.save();
  res.redirect(`/admin/products/edit/${req.body.id}`);
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
