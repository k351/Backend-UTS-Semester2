const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const transactions = require('./components/transactions/transactions-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);  
  transactions(app);

  return app;
};
