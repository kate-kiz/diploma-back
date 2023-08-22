const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  messageError,
  codeCreated,
} = require('../errors/errors');
// const { handleErrors } = require('../errors/errors');

const { JWT_SECRET, NODE_ENV } = process.env;

const getMyProfile = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(messageError.notFoundError);
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      next(error);
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(codeCreated.OK).send({
      name: user.name, email: user.email, _id: user._id,
    }))
    .catch((error) => next(error));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(messageError.UnauthorizedError);
      }
      bcrypt.compare(password, user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const token = jwt.sign(
              { _id: user._id },
              NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
              { expiresIn: '7d' },
            );
            // console.log(token);
            // res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true })
            //   .send({ token });
            res.send({ token });
          } else {
            throw new UnauthorizedError(messageError.UnauthorizedError);
          }
        }).catch((error) => next(error));
    }).catch((error) => next(error));
};

const updateInfo = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(messageError.notFoundError);
      } else {
        res.send({ data: user });
      }
    })
    .catch((error) => next(error));
};

module.exports = {
  getMyProfile, createUser, updateInfo, login,
};
