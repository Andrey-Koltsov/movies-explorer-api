const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { CREATED_CODE } = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

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
    return res.status(CREATED_CODE).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные'));
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
    return next(new NotFoundError('Пользователь не найден'));
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthorizedError('Неправильный пользователь или пароль'));
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return next(new UnauthorizedError('Неправильный пользователь или пароль'));
    }

    const token = jwt.sign({
      _id: user._id,
    }, NODE_ENV === 'production' ? JWT_SECRET : 'secret');

    return res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    })
      .send({ message: 'Успешная авторизация', token });
  } catch (err) {
    return next(err);
  }
};

const signout = (req, res, next) => {
  try {
    res.clearCookie('jwt').send({ message: 'Выход' });
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
