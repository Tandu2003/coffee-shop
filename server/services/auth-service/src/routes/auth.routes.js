const express = require('express');

const AuthController = require('../controllers/auth.controller');
const VerifyController = require('../controllers/verify.controller');

const Router = express.Router();

// Routes for /api/auth
Router.get('/', AuthController.getAuth);
Router.post('/login', AuthController.postLogin);
Router.post('/logout', AuthController.postLogout);
Router.post('/register', AuthController.postRegister);

// Routes for /user/verify
Router.get('/user/verify', VerifyController.getVerify);
Router.get(
  '/user/verify/:userId/:uniqueString',
  VerifyController.getVerifyUser,
);

module.exports = Router;
