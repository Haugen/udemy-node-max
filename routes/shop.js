const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

router.get('/user', (req, res) => {
  res.send('Users page!');
});

module.exports = router;
