const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');
const validators = require('../middleware/validators');

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/reset-password', authController.getResetPassword);
router.get('/new-password/:token', authController.getNewPassword);

router.post('/login', validators.login, authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/signup', validators.signUp, authController.postSignup);
router.post('/reset-password', authController.postResetPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
