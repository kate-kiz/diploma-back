const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const cookies = require('cookie-parser');
const { errors } = require('celebrate');
require('dotenv').config();

const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { handleErrors } = require('./middlewares/errors');
const NotFoundError = require('./errors/NotFoundError');
const { messageError } = require('./errors/errors');
const { registerValidation, loginValidation } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  MONGODB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
  PORT = 3000 || 4000,
} = process.env;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
});

const app = express();
const ALLOWED_CORS = [process.env.ALLOWED_ORIGINS_HTTP, process.env.ALLOWED_ORIGINS_HTTPS, 'localhost:3000'];
console.log(process.env);

app.use((req, res, next) => {
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (ALLOWED_CORS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.end();
  }

  return next();
});

// app.use(cookies());
app.use(bodyParser.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', loginValidation, login);
app.post('/signup', registerValidation, createUser);

app.use(auth);

app.use('/users', userRoutes);
app.use('/movies', movieRoutes);

app.use(errors());

app.use('/', (req, res, next) => {
  next(new NotFoundError(messageError.notFoundError));
});
app.use(errorLogger);
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
