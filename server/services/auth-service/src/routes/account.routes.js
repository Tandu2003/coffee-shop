const express = require('express');
const AccountController = require('../controllers/account.controller');

const checkAdmin = require('../middleware/checkAdmin');

const Router = express.Router();

Router.get('/', checkAdmin, AccountController.getAccounts);
Router.post('/:email', checkAdmin, AccountController.updateAdmin);

module.exports = Router;
