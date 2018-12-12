const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const validators = require('../middleware/validators');

router.get('/products', isAuth, adminController.getAdminProducts);
router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/products/edit/:id', isAuth, adminController.getEditProduct);

router.post(
  '/add-product',
  isAuth,
  validators.editProduct,
  adminController.postAddProduct
);
router.post(
  '/products/edit',
  isAuth,
  validators.editProduct,
  adminController.postEditProduct
);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
