const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

// Made .env file available
require('dotenv').config();

// Initiate the express app.
const app = express();

// Temporary get my demo user.
app.use((req, res, next) => {
  User.findById('5c05939b9f8db9cc7b6c6da4')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(error => {
      console.log(error);
      next();
    });
});

// Setting the template engine to EJS.
app.set('view engine', 'ejs');

// Setting up session and cookie storage.
const sessionStore = new session.MemoryStore();
app.use(cookieParser('some secret'));
app.use(
  session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'some secret'
  })
);

// Add body-parser middleware.
app.use(bodyParser.urlencoded({ extended: false }));

// Telling Express to serve "public" folder content publically.
app.use(express.static(path.join(__dirname, 'public')));

// Custom flash message middleware.
app.use('/', (req, res, next) => {
  res.locals.siteMessages = req.session.siteMessages || [];
  req.session.siteMessages = [];
  next();
});

// Using two separate custom Express routers.
app.use(shopRoutes);
app.use('/admin', adminRoutes);

// If a URL is not caught by the routers above, use 404 response below.
app.use('/', (req, res) => {
  res.status(404).render('404', {
    title: 'Page not found.',
    path: ''
  });
});

// Connect to db with Mongoose and start app on success.
mongoose
  .connect(
    `mongodb+srv://root:${
      process.env.MONGO_DB_PASSWORD
    }@udemy-node-s3ewq.mongodb.net/shop?retryWrites=true`
  )
  .then(() => {
    // For now, set up a demo user if it doesn't already exist.
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Tobias Haugen',
          email: 'tobiashaugen@gmail.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(error => {
    console.log(error);
  });
