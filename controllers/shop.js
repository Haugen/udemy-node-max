const Product = require('../models/product');
const Order = require('../models/order');

exports.getFront = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        title: 'Welcome to my shop',
        path: '/',
        products: products,
        isLoggedIn: req.session.isLoggedIn
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        title: 'Product list',
        path: '/products',
        products: products,
        isLoggedIn: req.session.isLoggedIn
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getProduct = (req, res) => {
  Product.findById(req.params.productId)
    .then(product => {
      res.render('shop/product-detail', {
        title: product.title,
        path: '/products',
        product: product,
        isLoggedIn: req.session.isLoggedIn
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
  console.log(req.session.user);
  req.session.user
    .populate('cart.items.product')
    .execPopulate()
    .then(user => {
      res.render('shop/cart', {
        title: 'Shopping Cart',
        path: '/cart',
        products: user.cart.items,
        isLoggedIn: req.session.isLoggedIn
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
  req.session.user.removeProductFromCart(req.params.id).then(() => {
    res.redirect('/cart');
  });
};

exports.postCart = (req, res) => {
  Product.findById(req.body.productId)
    .then(product => {
      return req.session.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/');
    });
};

exports.postOrder = (req, res) => {
  req.session.user
    .populate('cart.items.product')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(item => {
        return {
          product: { ...item.product._doc },
          quantity: item.quantity
        };
      });

      const order = new Order({
        products: products,
        userId: req.session.user._id
      });

      return order.save();
    })
    .then(() => {
      req.session.user.clearCart();
      res.redirect('/orders');
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getOrders = (req, res) => {
  Order.find({
    userId: req.session.user._id
  }).then(orders => {
    res.render('shop/orders', {
      title: 'Orders',
      path: '/orders',
      orders: orders,
      isLoggedIn: req.session.isLoggedIn
    });
  });
};
