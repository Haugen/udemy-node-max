const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // console.log('URL', req.url);
  // console.log('Method', req.method);
  // console.log('Headers', req.headers);

  const URL = req.url;
  const METHOD = req.method;

  if (URL === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write(`
      <h1>Front page</h1>
      <a href="/add-data">Add data</a>
    `);
    return res.end();
  } else if (URL === '/message' && METHOD === 'POST') {
    const body = [];
    req.on('data', chunk => {
      body.push(chunk);
    });
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFileSync('data.txt', message);
    });
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  } else if (URL === '/json') {
    res.setHeader('Content-Type', 'application/json');
    res.write(`{
      "test": "test item",
      "items": {
        "item 1": 3434,
        "item 2": 23
      }
    }
    `);
    return res.end();
  } else if (URL === '/add-data') {
    res.setHeader('Content-Type', 'text/html');
    res.write(`
      <form method="POST" action="/message">
        <input type="text" name="message" />
        <button type="submit">Add text</button>
      </form>
    `);
    return res.end();
  }

  // res.write('<h1>Some unknown page</h1>');
  // res.write('<a href="/">Head back home</a>');
  // res.end();
});

server.listen(3000, 'localhost');
