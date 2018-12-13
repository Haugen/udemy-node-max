const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

router.get('/', shopController.getFront);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/cart', isAuth, shopController.getCart);
router.get('/cart/remove/:id', isAuth, shopController.getCartRemove);
// router.get('/cart/increase-quantity/:id', shopController.getIncreaseQuantity);
// router.get('/cart/decrease-quantity/:id', shopController.getDecreaseQuantity);
router.get('/orders', isAuth, shopController.getOrders);
router.get('/checkout', isAuth, shopController.getCheckout);

router.post('/add-to-cart', isAuth, shopController.postCart);

module.exports = router;
