const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/products', adminController.getAdminProducts);
router.get('/add-product', adminController.getAddProduct);
router.get('/products/edit/:id', adminController.getEditProduct);

router.post('/add-product', adminController.postAddProduct);
router.post('/products/edit', adminController.postEditProduct);
router.post('/products/delete', adminController.postDeleteProduct);

module.exports = router;
