const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/reset-password', authController.getResetPassword);
router.get('/new-password/:token', authController.getNewPassword);

router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/signup', authController.postSignup);
router.post('/reset-password', authController.postResetPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
