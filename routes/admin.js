const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

router.get('/products', isAuth, adminController.getAdminProducts);
router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/products/edit/:id', isAuth, adminController.getEditProduct);

router.post('/add-product', isAuth, adminController.postAddProduct);
router.post('/products/edit', isAuth, adminController.postEditProduct);
router.post('/products/delete', isAuth, adminController.postDeleteProduct);

module.exports = router;
