const express = require('express');
const AccountController = require('../controllers/account.controller');

const checkAdmin = require('../middleware/checkAdmin');

const Router = express.Router();

Router.get('/', checkAdmin, AccountController.getAccounts);
Router.put('/:email', checkAdmin, AccountController.updateAdmin);
Router.delete('/:email', checkAdmin, AccountController.deleteAccount);

module.exports = Router;
