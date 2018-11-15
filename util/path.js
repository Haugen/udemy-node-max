const path = require('path');

// Helper function. rootDir will give the absolute dir path for wherever it's used.
const rootDir = path.dirname(process.mainModule.filename);

module.exports = rootDir;
