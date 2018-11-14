const express = require('express');
const bodyParser = require('body-parser');

// Initiate the Express app, and then have it listen on port 3000.
const app = express();
app.listen(3000);

// Add body-parser middleware.
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user', (req, res, next) => {
  res.send('Users page!');
});

app.post('/add', (req, res, next) => {
  res.send(`
    <form method="POST" action="/add-product">
      <input type="text" name="title" />
      <button type="submit">Add product</button>
    </form>
  `);
});

app.use('/add-product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

app.use('/', (req, res, next) => {
  res.send('<h1>Title!</h1><a href="/add">Add product</a>');
});
