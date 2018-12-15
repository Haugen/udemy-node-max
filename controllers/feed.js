const uniqid = require('uniqid');

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
  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    message: 'Post successfully created.',
    post: {
      id: uniqid(),
      title: title,
      content: content,
      creator: {
        name: 'Tobias'
      },
      createdAt: new Date()
    }
  });
};
