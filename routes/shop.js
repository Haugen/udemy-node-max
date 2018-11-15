const path = require('path');

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/shop', {
    title: 'Welcome to my shop'
  });
});

module.exports = router;
