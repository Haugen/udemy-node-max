const User = require('../models/user');

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    path: '/login',
    isLoggedIn: req.session.isLoggedIn
  });
};

exports.postLogin = (req, res) => {
  User.findById('5c06a9e6c60905e01a472200')
    .then(user => {
      console.log(user);
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(() => {
        res.redirect('/');
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
