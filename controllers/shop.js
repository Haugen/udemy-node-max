const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getFront = (req, res) => {
  Product.getAllProducts()
    .then(products => {
      console.log(products);
      res.render('shop/index', {
        title: 'Welcome to my shop',
        path: '/',
        products: products
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getProducts = (req, res) => {
  Product.getAllProducts()
    .then(products => {
      res.render('shop/product-list', {
        title: 'Product list',
        path: '/products',
        products: products
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getProduct = (req, res) => {
  Product.getProductById(req.params.productId)
    .then(product => {
      res.render('shop/product-detail', {
        title: product.title,
        path: '/products',
        product: product
      });
    })
    .catch(error => {
      console.log(error);
      req.session.siteMessages.push({
        type: 'warning',
        message: 'Product not found.'
      });

      res.redirect('/404');
    });
};

exports.getCart = (req, res) => {
  Cart.getCart(cart => {
    res.render('shop/cart', {
      title: 'Shopping Cart',
      path: '/cart',
      products: cart.products,
      totalPrice: cart.totalPrice
    });
  });
};

exports.getIncreaseQuantity = (req, res) => {
  Cart.adjustQuantity(req.params.id, 'increase', error => {
    if (!error) {
      res.redirect('/cart');
    }
  });
};

exports.getDecreaseQuantity = (req, res) => {
  Cart.adjustQuantity(req.params.id, 'decrease', error => {
    if (!error) {
      res.redirect('/cart');
    }
  });
};

exports.getCartRemove = (req, res) => {
  Cart.removeProduct(req.params.id);
  res.redirect('/cart');
};

exports.postCart = (req, res) => {
  Product.getProductById(req.body.productId, product => {
    if (product) {
      Cart.addProduct(product);
      res.redirect('/cart');
    } else {
      res.redirect('/404');
    }
  });
};

exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    title: 'Orders',
    path: '/orders'
  });
};
