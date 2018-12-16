const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(result => {
      res.status(200).json({
        message: 'Successfully fetched posts.',
        posts: result
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  console.log(postId);
  Post.findById(postId)
    .then(post => {
      if (!post) {
        throw Error('No post found!');
      }
      res.status(200).json({
        message: 'Post fetched.',
        post: post
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.postPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed.',
      errors: errors.array()
    });
  }

  if (!req.file) {
    throw new Error('An image is required.');
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: {
      name: 'Tobias'
    }
  });

  post
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Post successfully created.',
        post: post
      });
    })
    .catch(error => {
      console.log(error);
    });
};
