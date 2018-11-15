const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');

// Initiate the Express app, and then have it listen on port 3000.
const app = express();
app.listen(3000);

// Setting the template engine to EJS.
app.set('view engine', 'ejs');

// Add body-parser middleware.
app.use(bodyParser.urlencoded({ extended: false }));

// Telling Express to serve "public" folder content publically.
app.use(express.static(path.join(__dirname, 'public')));

// Using two separate custom Express routers.
app.use(shopRoutes);
app.use('/admin', adminRoutes);

// If a URL is not caught by the routers above, use 404 response below.
app.use('/', (req, res) => {
  res.status(404);
  res.render('pages/404');
});
