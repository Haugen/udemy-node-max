const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    path: '/login',
    isLoggedIn: req.session.isLoggedIn
  });
};

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    title: 'Sign up',
    path: '/signup',
    isLoggedIn: req.session.isLoggedIn
  });
};

exports.postLogin = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        req.session.siteMessages.push({
          type: 'warning',
          message: 'E-mail address not found.'
        });
        return res.redirect('/login');
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then(passwordSuccess => {
          if (!passwordSuccess) {
            req.session.siteMessages.push({
              type: 'warning',
              message: 'Incorrect password.'
            });
            return res.redirect('/login');
          }
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save(() => {
            req.session.siteMessages.push({
              type: 'success',
              message: `Welcome, ${user.name}`
            });
            res.redirect('/');
          });
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.postSignup = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        req.session.siteMessages.push({
          type: 'warning',
          message: 'That e-mail address is already registered.'
        });
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(req.body.password, 12)
        .then(hashedPassword => {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return newUser.save();
        })
        .then(() => {
          req.session.siteMessages.push({
            type: 'success',
            message: "User successfully created. You're now free to login!"
          });
          res.redirect('/login');
        });
    })
    .catch(error => {
      console.log(error);
    });
};
