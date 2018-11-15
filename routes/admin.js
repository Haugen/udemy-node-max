const express = require('express');

const router = express.Router();

router.get('/add', (req, res, next) => {
  res.send(`
    <form method="POST" action="/add-product">
      <input type="text" name="title" />
      <button type="submit">Add product</button>
    </form>
  `);
});

router.post('/add-product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;
