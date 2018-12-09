const express = require('express');
const { check } = require('express-validator/check');

const router = express.Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/reset-password', authController.getResetPassword);
router.get('/new-password/:token', authController.getNewPassword);

router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post(
  '/signup',
  check('email')
    .isEmail()
    .withMessage('Please enter a valid e-mail address.'),
  authController.postSignup
);
router.post('/reset-password', authController.postResetPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
