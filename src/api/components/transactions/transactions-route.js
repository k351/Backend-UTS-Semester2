const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const transactionsController = require('./transactions-controller');
const transactionsValidator = require('./transactions-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/users', route);

  // Create Transaction
  route.post(
    '/:user_id/transaction',
    authenticationMiddleware,
    celebrate(transactionsValidator.createTransaction),
    transactionsController.createTransaction,
  );

};
