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
    }),
  body(
    'password',
    'Please choose a password that is at least five characters long.'
  ).isLength({ min: 5 }),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Your password do not match.');
    }
    return true;
  })
];

validators.login = [
  check('email', 'Please enter a valid e-mail address.').isEmail()
];

module.exports = validators;