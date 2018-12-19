const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const Post = require('../models/post');
const User = require('../models/user');

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, error => {
    console.log(error);
  });
};

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
  let creator;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId
  });

  post
    .save()
    .then(() => {
      return User.findById(req.userId);
    })
    .then(user => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then(() => {
      res.status(201).json({
        message: 'Post successfully created.',
        post: post,
        creator: {
          _id: creator._id,
          name: creator.name
        }
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed.',
      errors: errors.array()
    });
  }

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.imageUrl;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    throw new Error('No image picked.');
  }

  Post.findById(postId)
    .then(post => {
      if (!post) {
        throw new Error('No post found!');
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then(result => {
      res.status(200).json({
        message: 'Post updated.',
        post: result
      });
    })
    .catch(error => console.log(error));
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        throw new Error('No post found.');
      }
      if (post.imageUrl) {
        clearImage(post.imageUrl);
      }
      return Post.findByIdAndRemove(postId);
    })
    .then(result => {
      res.status(200).json({
        message: 'Post successfully deleted.',
        post: result
      });
    })
    .catch(error => {
      console.log(error);
    });
};
