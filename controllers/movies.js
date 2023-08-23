const Movie = require('../models/movie');
const {
  messageError,
  codeCreated,
} = require('../errors/errors');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((results) => res.send({ data: results }))
    .catch((error) => next(error));
};

const addMovie = (req, res, next) => {
  console.log(req);
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
  const userId = req.user._id;
  Movie.create({
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
    owner: userId,
  })
    .then((movie) => res.status(codeCreated.OK).send({ data: movie }))
    .catch((error) => next(error));
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params._id;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(messageError.notFoundError);
      }
      if (req.user._id === movie.owner.toString()) {
        return movie.deleteOne()
          .then((result) => (res.send({ data: result })))
          .catch((error) => next(error, req, res));
      }
      throw new ForbiddenError(messageError.ForbiddenError);
    })
    .catch((error) => next(error));
};

// const likeCard = (req, res, next) => {
//   const { cardId } = req.params;
//   Movie.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
//     .then((card) => {
//       if (!card) {
//         throw new NotFoundError(messageError.notFoundError);
//       } else {
//         res.send({ data: card });
//       }
//     })
//     .catch((error) => next(error));
// };

// const dislikeCard = (req, res, next) => {
//   const { cardId } = req.params;
//   Movie.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
//     .then((card) => {
//       if (!card) {
//         throw new NotFoundError(messageError.notFoundError);
//       } else {
//         res.send({ data: card });
//       }
//     })
//     .catch((error) => next(error));
// };

module.exports = {
  getMovies, addMovie, deleteMovie,
};
