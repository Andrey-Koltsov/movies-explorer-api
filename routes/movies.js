const { celebrate, Joi } = require('celebrate');

const express = require('express');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { URL_REGEXP } = require('../utils/constants');

const movieRoutes = express.Router();

movieRoutes.get('/', getMovies);

movieRoutes.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(URL_REGEXP),
    trailerLink: Joi.string().required().pattern(URL_REGEXP),
    thumbnail: Joi.string().required().pattern(URL_REGEXP),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

movieRoutes.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = movieRoutes;
