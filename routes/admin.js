const path = require('path');
const fs = require('fs');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

router.get('/add', (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/add-product', (req, res) => {
  fs.writeFile('product.txt', req.body.title, error => {
    res.redirect('/');
  });
});

module.exports = router;
