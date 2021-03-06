const bcrypt = require('bcryptjs');
const validators = require('../middleware/validation');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');
const Post = require('../models/post');
const clearImage = require('../util/file');

module.exports = {
  createUser: async (args, req) => {
    const errors = validators.signup(args.userInput);

    if (errors.length > 0) {
      const error = new Error('Invalid input');
      error.data = errors;
      throw error;
    }

    const { email, name, password } = args.userInput;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error('User already exists');
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      name,
      password: hashedPassword
    });
    const createdUser = await user.save();

    return {
      ...createdUser._doc,
      _id: createdUser._id.toString()
    };
  },

  login: async (args, req) => {
    const { email, password } = args;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User not found');
    }

    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      throw new Error('Email and password do not match.');
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email
      },
      process.env.JWT_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    return {
      token: token,
      userId: user._id.toString()
    };
  },

  createPost: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Not authenticated.');
    }

    const errors = validators.createPost(args.postInput);
    if (errors.length > 0) {
      const error = new Error('Invalid input');
      error.data = errors;
      throw error;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error('Invalid user.');
    }

    const { title, content, imageUrl } = args.postInput;
    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: user
    });
    const createdPost = await post.save();

    user.posts.push(createdPost);
    await user.save();

    return {
      ...createdPost._doc,
      _id: createdPost._id.toString()
    };
  },

  updatePost: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Not authenticated.');
    }

    const postId = args.id;

    const post = await Post.findById(postId).populate('creator');
    if (!post) {
      throw new Error('Post to update not found.');
    }

    if (post.creator._id.toString() !== req.userId) {
      throw new Error('You are not authorized to edit this post.');
    }

    const errors = validators.createPost(args.postInput);
    if (errors.length > 0) {
      const error = new Error('Invalid input');
      error.data = errors;
      throw error;
    }

    const { title, content, imageUrl } = args.postInput;
    (post.title = title), (post.content = content);
    if (imageUrl !== 'undefined') {
      post.imageUrl = imageUrl;
    }

    const updatedPost = await post.save();

    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString()
    };
  },

  deletePost: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Not authenticated.');
    }

    const postId = args.id;

    const post = await Post.findById(postId);
    if (post.creator.toString() !== req.userId) {
      throw new Error('Not your post to delete.');
    }

    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);

    const user = await User.findById(post.creator);
    user.posts.pull(postId);
    await user.save();

    return true;
  },

  posts: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Not authenticated.');
    }

    const totalPosts = await Post.find().countDocuments();
    let posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('creator');
    posts = posts.map(p => {
      return {
        ...p._doc,
        _id: p._id.toString(),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString()
      };
    });

    return {
      posts: posts,
      totalPosts: totalPosts
    };
  },

  post: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Not authenticated.');
    }

    const post = await Post.findById(args.id).populate('creator');

    if (!post) {
      throw new Error('Post not found.');
    }

    return {
      ...post._doc,
      id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    };
  },

  user: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Not authenticated.');
    }

    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error('No user found.');
    }

    return {
      ...user._doc,
      _id: user._id.toString()
    };
  },

  updateStatus: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Not authenticated.');
    }

    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error('No user found.');
    }

    user.status = args.status;
    await user.save();

    return {
      ...user._doc,
      _id: user._id.toString()
    };
  }
};
