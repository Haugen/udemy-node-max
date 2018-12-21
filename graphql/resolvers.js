const bcrypt = require('bcryptjs');
const validators = require('../middleware/validation');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');

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
  }
};
