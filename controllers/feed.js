const uniqid = require('uniqid');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: 'A samle post',
        content: 'The content of the sample post.',
        imageUrl: 'images/bird.jpeg'
      }
    ],
    totalItems: this.posts.length
  });
};

exports.postPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    message: 'Post successfully created.',
    post: {
      id: uniqid(),
      title: title,
      content: content
    }
  });
};
