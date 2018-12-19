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

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw Error('No post found!');
    }
    res.status(200).json({
      message: 'Post fetched.',
      post: post
    });
  } catch (error) {
    console.log(error);
  }
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
      if (post.creator.toString() !== req.userId.toString()) {
        throw new Error('You are not authorized to edit this post.');
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
      if (post.creator.toString() !== req.userId.toString()) {
        throw new Error('You are not authorized to delete this post.');
      }
      if (post.imageUrl) {
        clearImage(post.imageUrl);
      }
      return Post.findByIdAndRemove(postId);
    })
    .then(() => {
      return User.findById(req.userId);
    })
    .then(user => {
      user.posts.pull(postId);
      return user.save();
    })
    .then(() => {
      res.status(200).json({
        message: 'Post successfully deleted.',
        post: result
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.getStatus = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        throw new Error('No user found.');
      }

      res.status(200).json({
        message: 'Status fetched.',
        status: user.status
      });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.updateStatus = (req, res, next) => {
  const status = req.body.status;

  User.findById(req.userId)
    .then(user => {
      if (!user) {
        throw new Error('No user found.');
      }

      user.status = status;
      return user.save();
    })
    .then(user => {
      res.status(200).json({
        message: 'Status updated.',
        user: user
      });
    })
    .catch(error => {
      console.log(error);
    });
};
