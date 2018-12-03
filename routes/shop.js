const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');

router.get('/', shopController.getFront);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
// router.get('/cart', shopController.getCart);
// router.get('/cart/remove/:id', shopController.getCartRemove);
// router.get('/cart/increase-quantity/:id', shopController.getIncreaseQuantity);
// router.get('/cart/decrease-quantity/:id', shopController.getDecreaseQuantity);
// router.get('/orders', shopController.getOrders);

// router.post('/add-to-cart', shopController.postCart);
// router.post('/create-order', shopController.postOrder);

module.exports = router;
