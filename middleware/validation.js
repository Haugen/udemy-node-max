const { body } = require('express-validator/check');

const validators = {};

validators.postPost = [
  body('title')
    .trim()
    .isLength({ min: 5 }),
  body('content')
    .trim()
    .isLength({ min: 5 })
];

module.exports = validators;
