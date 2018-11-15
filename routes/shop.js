const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('<h1>Start page!</h1><a href="/add">Add product</a>');
});

router.get('/user', (req, res, next) => {
  res.send('Users page!');
});

module.exports = router;
