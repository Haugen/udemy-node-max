const validator = require('validator');

const validators = {};

validators.signup = userInput => {
  const errors = [];
  const { email, name, password } = userInput;

  if (!validator.isEmail(email)) {
    errors.push('Please enter a valid e-mail address.');
  }
  if (!validator.isLength(password, { min: 5 })) {
    errors.push(
      'Please choose a password that is at least five characters long.'
    );
  }
  if (validator.isEmpty(name)) {
    errors.push("You do have a name, don't you?");
  }

  return errors;
};

validators.createPost = postData => {
  const errors = [];
  const { title, content } = postData;

  if (!validator.isLength(title, { min: 5 })) {
    errors.push('Title must be at least five characters long.');
  }
  if (!validator.isLength(content, { min: 10 })) {
    errors.push('Content must be at least 10 characters long.');
  }

  return errors;
};

module.exports = validators;
