require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_KEY);

const Product = require('../models/product');
const Order = require('../models/order');
const errorHandling = require('../util/errorHandling');

exports.getFront = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        title: 'Welcome to my shop',
        path: '/',
        products: products,
        csrfToken: req.csrfToken()
      });
    })
    .catch(error => {
      next(errorHandling(error));
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        title: 'Product list',
        path: '/products',
        products: products
      });
    })
    .catch(error => {
      next(errorHandling(error));
    });
};

exports.getProduct = (req, res) => {
  Product.findById(req.params.productId)
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
  req.user
    .populate('cart.items.product')
    .execPopulate()
    .then(user => {
      res.render('shop/cart', {
        title: 'Shopping Cart',
        path: '/cart',
        products: user.cart.items
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
  Product.findById(req.body.productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/');
    });
};

exports.postCreateOrder = (req, res, next) => {
  const token = req.body.stripeToken;
  let totalPrice = 0;

  req.user
    .populate('cart.items.product')
    .execPopulate()
    .then(user => {
      user.cart.items.forEach(p => {
        totalPrice += p.quantity * p.product.price;
      });

      const products = user.cart.items.map(item => {
        return {
          product: { ...item.product._doc },
          quantity: item.quantity
        };
      });

      const order = new Order({
        products: products,
        userId: req.user._id
      });

      return order.save();
    })
    .then(result => {
      const charge = stripe.charges.create({
        amount: totalPrice * 100,
        currency: 'usd',
        description: 'Example charge',
        source: token,
        metadata: {
          order_id: result._id.toString()
        }
      });
      return charge;
    })
    .then(() => {
      req.session.siteMessages.push({
        type: 'success',
        message: 'Your order has been placed. Time to celebrate!'
      });

      req.user.clearCart();
      res.redirect('/orders');
    })
    .catch(error => {
      console.log(error);
      next(errorHandling(error));
    });
};

exports.getOrders = (req, res) => {
  Order.find({
    userId: req.user._id
  }).then(orders => {
    res.render('shop/orders', {
      title: 'Orders',
      path: '/orders',
      orders: orders
    });
  });
};

exports.getCheckout = (req, res, next) => {
  req.user
    .populate('cart.items.product')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      let total = 0;

      products.forEach(p => {
        total += p.quantity * p.product.price;
      });

      res.render('shop/checkout', {
        title: 'Checkout',
        path: '/checkout',
        products: user.cart.items,
        totalPrice: total
      });
    })
    .catch(err => {
      next(errorHandling(err));
    });
};
