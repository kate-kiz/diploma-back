const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {

        validator: (v) => validator.isURL(v),

        message: 'Некорректный URL',

      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {

        validator: (v) => validator.isURL(v),

        message: 'Некорректный URL',

      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {

        validator: (v) => validator.isURL(v),

        message: 'Некорректный URL',

      },
    },
    movieId: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
      // match: /^[А-ЯЁа-яё0-9\s]+$/,
    },
    nameEN: {
      type: String,
      required: true,
      // match: /^[A-Za-z0-9\s]+$/,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('movie', movieSchema);
