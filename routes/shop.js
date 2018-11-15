const express = require('express');

const router = express.Router();

const adminObj = require('./admin');

router.get('/', (req, res) => {
  res.render('pages/shop', {
    title: 'Welcome to my shop',
    products: adminObj.products,
    path: '/'
  });
});

module.exports = router;
