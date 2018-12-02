const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getFront = (req, res) => {
  Product.getAllProducts()
    .then(products => {
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
  req.user.getCart().then(cartItems => {
    res.render('shop/cart', {
      title: 'Shopping Cart',
      path: '/cart',
      products: cartItems
      //totalPrice: cart.totalPrice
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
  req.user.removeProductFromCart(req.params.id).then(() => {
    res.redirect('/cart');
  });
};

exports.postCart = (req, res) => {
  Product.getProductById(req.body.productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/');
    });
};

exports.postOrder = (req, res) => {
  req.user
    .createOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getOrders = (req, res) => {
  req.user.getOrders().then(orders => {
    res.render('shop/orders', {
      title: 'Orders',
      path: '/orders',
      orders: orders
    });
  });
};
