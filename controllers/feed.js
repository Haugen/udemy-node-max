const uniqid = require('uniqid');
const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'A samle post',
        content: 'The content of the sample post.',
        imageUrl: 'images/bird.jpeg',
        creator: {
          name: 'Tobias Haugen'
        },
        createdAt: new Date()
      }
    ]
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

  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title: title,
    content: content,
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
