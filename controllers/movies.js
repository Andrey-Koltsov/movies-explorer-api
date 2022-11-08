const Movie = require('../models/Movie');
const { BAD_REQUESTS_MESSAGE, FORBIDDEN_MESSAGE, NOT_FOUND_MOVIE_MESSAGE } = require('../utils/constants');
const { CREATED_CODE } = require('../utils/codes');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;

    const card = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: req.user._id,
    });

    return res.status(CREATED_CODE).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(BAD_REQUESTS_MESSAGE));
    }
    return next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      if (movie.owner.toString() === req.user._id) {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (deletedMovie) {
          return res.send(deletedMovie);
        }
      }
      return next(new ForbiddenError(FORBIDDEN_MESSAGE));
    }
    return next(new NotFoundError(NOT_FOUND_MOVIE_MESSAGE));
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return next(new BadRequestError(BAD_REQUESTS_MESSAGE));
    }
    return next(err);
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
