const initMoviesRoutes = require('express').Router();
const {
  getMovies, addMovie, deleteMovie,
} = require('../controllers/movies');
const { validationCreateMovie, userIdValidation } = require('../middlewares/validation');

initMoviesRoutes.get('/', getMovies);
initMoviesRoutes.post('/', validationCreateMovie, addMovie);
initMoviesRoutes.delete('/:movieId', userIdValidation, deleteMovie);

module.exports = initMoviesRoutes;
