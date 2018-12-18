const { body } = require('express-validator/check');

const User = require('../models/user');

const validators = {};

validators.postPost = [
  body('title')
    .trim()
    .isLength({ min: 5 }),
  body('content')
    .trim()
    .isLength({ min: 5 })
];

validators.signup = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid e-mail address')
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject('E-mail address already exist.');
        }
      });
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 5 }),
  body('name')
    .trim()
    .not()
    .isEmpty()
];

module.exports = validators;
