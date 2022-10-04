const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
