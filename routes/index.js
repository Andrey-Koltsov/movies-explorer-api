const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const { NOT_FOUND_PAGE_MESSAGE } = require('../utils/constants');

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use((req, res, next) => {
  next(new NotFoundError(NOT_FOUND_PAGE_MESSAGE));
});

module.exports = router;
