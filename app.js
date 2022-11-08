require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');

const {
  PORT = 3001,
  NODE_ENV,
  DB_ADDRESS,
  CORS_ORIGIN,
} = process.env;
const { DB_ADDRESS_DEV, CORS_ORIGIN_DEV } = require('./utils/configures');

const app = express();

const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./utils/limiter');

const { login, createUser, signout } = require('./controllers/users');
const router = require('./routes');

mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : DB_ADDRESS_DEV, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cors({
  origin: NODE_ENV === 'production' ? CORS_ORIGIN : CORS_ORIGIN_DEV,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);
app.get('/signout', signout);
app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
