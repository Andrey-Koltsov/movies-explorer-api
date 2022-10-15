const { SERVER_ERROR_CODE } = require('../utils/codes');
const { SERVER_ERROR_MESSAGE } = require('../utils/constants');

function errorsHandler(err, req, res, next) {
  const { statusCode = SERVER_ERROR_CODE, message } = err;
  res.status(statusCode).send({
    message: statusCode === SERVER_ERROR_CODE
      ? SERVER_ERROR_MESSAGE
      : message,
  });
  return next();
}

module.exports = errorsHandler;
