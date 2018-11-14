const fs = require('fs');

module.exports = (req, res) => {
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
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFile('data.txt', message, error => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
      });
    });
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

  res.write('<h1>Some unknown page</h1>');
  res.write('<a href="/">Head back home</a>');
  res.end();
};
