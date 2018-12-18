const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.get('Authorization').split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
  } catch (error) {
    throw error;
  }

  if (!decodedToken) {
    throw new Error('Not authenticated.');
  }

  req.userId = decodedToken.userId;
  next();
};
