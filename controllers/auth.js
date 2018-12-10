const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');
const errorHandling = require('../util/errorHandling');

require('dotenv').config();

const transporter = nodemailer.createTransport(
  sendgrid({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  })
);

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    path: '/login',
    oldInput: {
      email: ''
    }
  });
};

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    title: 'Sign up',
    path: '/signup',
    oldInput: {
      email: ''
    }
  });
};

exports.getResetPassword = (req, res) => {
  res.render('auth/reset-password', {
    title: 'Reset password',
    path: '/reset-password'
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        req.session.siteMessages.push({
          type: 'warning',
          message: 'Could not find a user with that email.'
        });
        res.redirect('/');
      } else {
        res.render('auth/new-password', {
          title: 'Enter new password',
          path: '/new-password',
          userId: user._id.toString(),
          passwordToken: token
        });
      }
    })
    .catch(error => {
      next(errorHandling(error));
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      if (!user) {
        req.session.siteMessages.push({
          type: 'warning',
          message: 'Could not find a user with that email.'
        });
        res.redirect('/');
      } else {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
      }
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      req.session.siteMessages.push({
        type: 'success',
        message: 'Your password has been reset. You can now login.'
      });
      res.redirect('/login');
    })
    .catch(error => {
      next(errorHandling(error));
    });
};

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      next(errorHandling(error));
    }

    const token = buffer.toString('hex');

    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.session.siteMessages.push({
            type: 'warning',
            message: 'Email address not found.'
          });
          res.redirect('/reset-password');
        } else {
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          return user.save();
        }
      })
      .then(result => {
        req.session.siteMessages.push({
          type: 'success',
          message: `A link to reset your password has been sent to ${
            req.body.email
          }.`
        });
        res.redirect('/');

        transporter.sendMail({
          to: req.body.email,
          from: 'shop@nodecourse.com',
          subject: 'Reset password',
          html: `
            <h1>Password reset</h1>
            <p>If you didn't request a password reset please ignore this email.
            Otherwise click the link below to reset your password.</p>
            <p><a href="http://localhost:3000/new-password/${token}">Reset password</a></p>
          `
        });
      })
      .catch(error => {
        next(errorHandling(error));
      });
  });
};

exports.postLogin = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      title: 'Login',
      path: '/login',
      siteMessages: errors.array(),
      oldInput: {
        email: req.body.email
      }
    });
  }

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
          next(errorHandling(error));
        });
    })
    .catch(error => {
      next(errorHandling(error));
    });
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.postSignup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      title: 'Sign up',
      path: '/signup',
      siteMessages: errors.array(),
      oldInput: {
        email: req.body.email
      }
    });
  }

  bcrypt
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

      return transporter.sendMail({
        to: req.body.email,
        from: 'shop@nodecourse.com',
        subject: 'Welcome!',
        html: `
              <h1>Welcome, ${req.body.name}!</h1>
              <p>I'm so happy to see you want to use my shop, but don't shop too much dumb stuff!</p>
            `
      });
    })
    .catch(error => {
      next(errorHandling(error));
    });
};
