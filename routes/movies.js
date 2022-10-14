const { celebrate, Joi } = require('celebrate');

const express = require('express');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { validateUrl } = require('../utils/validators');

const movieRoutes = express.Router();

movieRoutes.get('/', getMovies);

movieRoutes.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateUrl),
    trailerLink: Joi.string().required().custom(validateUrl),
    thumbnail: Joi.string().required().custom(validateUrl),
    movieId: Joi.number().integer().required(),
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
