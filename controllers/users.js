const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { CREATED_CODE } = require('../utils/codes');
const { JWT_SECRET_DEV } = require('../utils/configures');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  BAD_REQUESTS_MESSAGE,
  AUTHORIZED_MESSAGE,
  EXIT_MESSAGE,
  LOGIN_ERROR_MESSAGE,
  NOT_FOUND_USER_MESSAGE,
  CONFLICT_EMAIL_MESSAGE,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: passwordHash,
    });

    const token = jwt.sign({
      _id: user._id,
    }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);

    return res.status(CREATED_CODE)
      .cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      })
      .send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError(CONFLICT_EMAIL_MESSAGE));
    }
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(BAD_REQUESTS_MESSAGE));
    }
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      {
        new: true,
        runValidators: true,
      },
    );
    if (user) {
      return res.send(user);
    }
    return next(new NotFoundError(NOT_FOUND_USER_MESSAGE));
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError(CONFLICT_EMAIL_MESSAGE));
    }
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(BAD_REQUESTS_MESSAGE));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthorizedError(LOGIN_ERROR_MESSAGE));
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return next(new UnauthorizedError(LOGIN_ERROR_MESSAGE));
    }

    const token = jwt.sign({
      _id: user._id,
    }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);

    return res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    })
      .send({ message: AUTHORIZED_MESSAGE, token });
  } catch (err) {
    return next(err);
  }
};

const signout = (req, res, next) => {
  try {
    res.clearCookie('jwt').send({ message: EXIT_MESSAGE });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserInfo,
  updateUser,
  createUser,
  login,
  signout,
};
