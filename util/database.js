const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://root:4lTAKbP8lL3Ux5Xt@udemy-node-s3ewq.mongodb.net/shop?retryWrites=true',
    { useNewUrlParser: true }
  )
    .then(client => {
      _db = client.db();
      callback();
    })
    .catch(error => {
      console.log(error);
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
