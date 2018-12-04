const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User = require('./models/user');

// Made .env file available
require('dotenv').config();

const MONGODB_URI = `mongodb+srv://root:${
  process.env.MONGO_DB_PASSWORD
}@udemy-node-s3ewq.mongodb.net/shop`;

console.log(MONGODB_URI);
// Initiate the express app.
const app = express();

// Setting the template engine to EJS.
app.set('view engine', 'ejs');

// Setting up session and cookie storage.
const sessionStore = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
app.use(cookieParser('some secret'));
app.use(
  session({
    store: sessionStore,
    saveUninitialized: false,
    resave: false,
    secret: 'some secret'
  })
);

// Again, temporary fetch a mongoose user model every request for the app to work.
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(error => {
      console.log(error);
    });
});

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
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// If a URL is not caught by the routers above, use 404 response below.
app.use('/', (req, res) => {
  res.status(404).render('404', {
    title: 'Page not found.',
    path: '',
    isLoggedIn: req.session.isLoggedIn
  });
});

// Connect to db with Mongoose and start app on success.
mongoose
  .connect(MONGODB_URI)
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
