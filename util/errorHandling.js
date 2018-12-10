const errorHandling = error => {
  console.log(error);
  const err = new Error(error);
  err.httpStatusCode = 500;
  return err;
};

module.exports = errorHandling;
