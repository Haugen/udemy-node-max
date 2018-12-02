const mongodb = require('mongodb');

const { getDb } = require('../util/database');

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    if (!this.cart.items) this.cart.items = [];

    const cartProductIndex = this.cart.items.findIndex(cartProduct => {
      return cartProduct.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectID(product._id),
        quantity: newQuantity
      });
    }

    const updatedCart = {
      items: updatedCartItems
    };

    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectID(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const cartProductIds = this.cart.items.map(product => product.productId);
    return db
      .collection('products')
      .find({ _id: { $in: cartProductIds } })
      .toArray()
      .then(products => {
        return products.map(product => {
          return {
            ...product,
            quantity: this.cart.items.find(p => {
              return p.productId.toString() === product._id.toString();
            }).quantity
          };
        });
      });
  }

  removeProductFromCart(productId) {
    const updatedCart = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });

    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectID(this._id) },
        { $set: { cart: { items: updatedCart } } }
      );
  }

  createOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          products: products,
          user: {
            _id: new mongodb.ObjectID(this._id),
            name: this.name
          }
        };
        return db.collection('orders').insertOne(order);
      })
      .then(() => {
        this.cart = { items: [] };
        return db
          .collection('users')
          .updateOne(
            { _id: new mongodb.ObjectID(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection('orders')
      .find({ 'user._id': new mongodb.ObjectID(this._id) })
      .toArray();
  }

  static getUserById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new mongodb.ObjectID(userId) });
  }
}

module.exports = User;