const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const feedRoutes = require('./routes/feed');

const app = express();

const MONGODB_URI = `mongodb+srv://root:${
  process.env.MONGO_DB_PASSWORD
}@udemy-node-s3ewq.mongodb.net/messages`;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

app.use('/feed', feedRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3001);
  })
  .catch(error => {
    console.log(error);
  });
