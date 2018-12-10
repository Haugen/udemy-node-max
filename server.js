const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User = require('./models/user');

// Made .env file available
require('dotenv').config();

const MONGODB_URI = `mongodb+srv://root:${
  process.env.MONGO_DB_PASSWORD
}@udemy-node-s3ewq.mongodb.net/shop`;

// Initiate the express app.
const app = express();

// Setting the template engine to EJS.
app.set('view engine', 'ejs');

// Add body-parser middleware.
app.use(bodyParser.urlencoded({ extended: false }));

// Telling Express to serve "public" folder content publically.
app.use(express.static(path.join(__dirname, 'public')));

// Setting up session and cookie storage, as well as csrf middleware.
const sessionStore = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();
app.use(cookieParser('some secret'));
app.use(
  session({
    store: sessionStore,
    saveUninitialized: false,
    resave: false,
    secret: 'some secret'
  })
);
app.use(csrfProtection);

// Again, temporary fetch a mongoose user model every request for the app to work.
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) return next();
      req.user = user;
      next();
    })
    .catch(error => {
      throw new Error(error);
    });
});

// Middleware for setting locals variables available in all views.
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.siteMessages = req.session.siteMessages || [];
  req.session.siteMessages = [];
  next();
});

// Using separate custom Express routers.
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Error page for 500 responses.
app.use('/500', (req, res) => {
  res.status(500).render('500', {
    title: 'An error occured',
    path: '',
    isLoggedIn: req.session.isLoggedIn
  });
});

// If a URL is not caught by the routers above, use 404 response below.
app.use('/', (req, res) => {
  res.status(404).render('404', {
    title: 'Page not found',
    path: '',
    isLoggedIn: req.session.isLoggedIn
  });
});

// Connect to db with Mongoose and start app on success.
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch(error => {
    console.log(error);
  });
