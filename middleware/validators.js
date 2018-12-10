const { check, body } = require('express-validator/check');

const User = require('../models/user');

const validators = {};

validators.signUp = [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid e-mail address.')
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject('That e-mail address is already registered.');
        }
      });
    })
    .normalizeEmail(),
  body(
    'password',
    'Please choose a password that is at least five characters long.'
  )
    .isLength({ min: 5 })
    .trim(),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Your password do not match.');
      }
      return true;
    })
    .trim()
];

validators.login = [
  body('email', 'Please enter a valid e-mail address.')
    .isEmail()
    .normalizeEmail()
];

validators.editProduct = [
  body('title')
    .isLength({ min: 5, max: 30 })
    .withMessage('The title needs to be between 5 and 30 characters.'),
  body('imageUrl')
    .isURL()
    .withMessage('Please enter a valid url.'),
  body('description')
    .isLength({ min: 10 })
    .withMessage('The description needs to be at least 10 characters long.'),
  body('price', 'Please enter a price in numbers')
    .isNumeric()
    .isLength({ min: 1 })
];

module.exports = validators;
