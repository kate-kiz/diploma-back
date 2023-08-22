const initUserRoutes = require('express').Router();
const {
  getMyProfile, updateInfo,
} = require('../controllers/users');
const { validationUpdateUser } = require('../middlewares/validation');

initUserRoutes.patch('/me', updateInfo);
initUserRoutes.get('/me', validationUpdateUser, getMyProfile);

module.exports = initUserRoutes;
