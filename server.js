const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Initiate the Express app, and then have it listen on port 3000.
const app = express();
app.listen(3000);

// Add body-parser middleware.
app.use(bodyParser.urlencoded({ extended: false }));

app.use(shopRoutes);
app.use(adminRoutes);

app.use('/', (req, res) => {
  res.status(404);
  res.send('<h1>404</h1>');
});
