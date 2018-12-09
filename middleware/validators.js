const { check, body } = require('express-validator/check');

const validators = {};

validators.signUp = [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid e-mail address.'),
  body(
    'password',
    'Please choose a password that is at least five characters long.'
  ).isLength({ min: 5 }),
  body('confirmPassword')
    .equals('password')
    .withMessage('Your password do not match.')
];

module.exports = validators;
