const fs = require('fs');
const path = require('path');

const rootPath = require('./path');

const getDataFromFile = (fileName, callback) => {
  const filePath = path.join(rootPath, 'data', fileName);
  fs.readFile(filePath, (error, fileData) => {
    if (!error) {
      callback(JSON.parse(fileData), filePath);
    } else {
      callback([], filePath);
    }
  });
};

module.exports = getDataFromFile;
