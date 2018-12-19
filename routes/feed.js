const express = require('express');

const feedController = require('../controllers/feed');
const validators = require('../middleware/validation');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/posts', isAuth, feedController.getPosts);
router.get('/post/:postId', isAuth, feedController.getPost);
router.get('/status', isAuth, feedController.getStatus);

router.post('/post', isAuth, validators.postPost, feedController.postPost);

router.put(
  '/post/:postId',
  isAuth,
  validators.postPost,
  feedController.updatePost
);
router.put('/status', isAuth, feedController.updateStatus);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
