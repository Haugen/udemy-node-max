const path = require('path');
const fs = require('fs');

const express = require('express');

const router = express.Router();

const products = [];

router.get('/add', (req, res) => {
  res.render('pages/add-product', {
    title: 'Add product',
    path: '/admin/add'
  });
});

router.post('/add-product', (req, res) => {
  products.push(req.body.title);
  res.redirect('/');
});

module.exports.router = router;
module.exports.products = products;
