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

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      message: 'Successfully fetched posts.',
      posts: posts
    });
  } catch (error) {
    console.log(error);
  }
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

exports.postPost = async (req, res, next) => {
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
    creator: req.userId
  });

  try {
    await post.save();

    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();

    res.status(201).json({
      message: 'Post successfully created.',
      post: post
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updatePost = async (req, res, next) => {
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

  try {
    const post = await Post.findById(postId);

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
    await post.save();

    res.status(200).json({
      message: 'Post updated.',
      post: post
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error('No post found.');
    }
    if (post.creator.toString() !== req.userId.toString()) {
      throw new Error('You are not authorized to delete this post.');
    }
    if (post.imageUrl) {
      clearImage(post.imageUrl);
    }

    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();

    res.status(200).json({
      message: 'Post successfully deleted.',
      post: post
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error('No user found.');
    }

    res.status(200).json({
      message: 'Status fetched.',
      status: user.status
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  const status = req.body.status;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      throw new Error('No user found.');
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      message: 'Status updated.',
      user: user
    });
  } catch (error) {
    console.log(error);
  }
};
