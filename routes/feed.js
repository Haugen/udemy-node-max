const express = require('express');

const feedController = require('../controllers/feed');
const validators = require('../middleware/validation');

const router = express.Router();

router.get('/posts', feedController.getPosts);

router.post('/post', validators.postPost, feedController.postPost);

module.exports = router;
