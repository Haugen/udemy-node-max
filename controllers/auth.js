const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed.',
      errors: errors.array()
    });
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email,
        name,
        password: hashedPassword
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'User created.',
        user: result
      });
    })
    .catch(error => {
      console.log(error);
    });
};
