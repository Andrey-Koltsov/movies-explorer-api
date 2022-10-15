const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { JWT_SECRET_DEV } = require('../utils/configures');
const { UNAUTHORIZED_MESSAGE } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

function auth(req, res, next) {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    next(new UnauthorizedError(UNAUTHORIZED_MESSAGE));
  }
  req.user = payload;
  next();
}

module.exports = auth;
