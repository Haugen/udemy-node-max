const http = require('http');

const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('In middleware 1');
  next();
});

app.use((req, res, next) => {
  console.log('In middleware 2');
  next();
});

app.use((req, res, next) => {
  console.log('In middleware 3');
});

const server = http.createServer(app);

server.listen(3000, 'localhost');
