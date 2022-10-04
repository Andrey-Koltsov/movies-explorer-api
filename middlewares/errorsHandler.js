const { SERVER_ERROR_CODE } = require('../utils/constants');

function errorsHandler(err, req, res, next) {
  const { statusCode = SERVER_ERROR_CODE, message } = err;
  res.status(statusCode).send({
    message: statusCode === SERVER_ERROR_CODE
      ? 'На сервере произошла ошибка'
      : message,
  });
  return next();
}

module.exports = errorsHandler;
