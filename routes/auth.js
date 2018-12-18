const express = require('express');

const authController = require('../controllers/auth');
const validators = require('../middleware/validation');

const router = express.Router();

router.put('/signup', validators.signup, authController.signup);

module.exports = router;
