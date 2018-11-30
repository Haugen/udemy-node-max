const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { mongoConnect } = require('./util/database');
const User = require('./models/user');

// Made .env file available
require('dotenv').config();

// Initiate the express app.
const app = express();

// Temporary get my demo user.
app.use((req, res, next) => {
  User.getUserById('5c0166891c9d4400005c7352')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id);
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

// Connect to mongoDB, and then listen on port 3000.
mongoConnect(() => {
  app.listen(3000);
});
