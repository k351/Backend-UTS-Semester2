const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const passport = require('passport');
const pinoHTTP = require('pino-http');

const config = require('./config');
const logger = require('./logger')('app');
const routes = require('../api');
const { errorResponder, errorHandler, errorTypes } = require('./errors');

const app = express();

// Useful if behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc).
// It shows the real origin IP in the Heroku or Cloudwatch logs.
app.enable('trust proxy');

// Enable cross origin resource sharing to all origins by default
app.use(cors());

// Enable passport for API authorization
app.use(passport.initialize());

// Let you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
app.use(require('method-override')());

// Middleware that transforms the raw string of req.body into JSON
app.use(bodyParser.json());

// Needed to use multipart/form-data for file uploads
app.use(bodyParser.urlencoded({ extended: false }));

// Log HTTP requests with Pino
app.use(pinoHTTP({ logger }));

// Health check endpoints
app.get('/status', (_, response) => response.status(200).end());
app.head('/status', (_, response) => response.status(200).end());

// API routes
app.use(`${config.api.prefix}`, routes());

// Handle 404 route
app.use((request, response, next) =>
  next(errorResponder(errorTypes.ROUTE_NOT_FOUND, 'Route not found'))
);

// Error loggers
app.use((error, request, response, next) => {
  const ctx = {
    code: error.code,
    status: error.status,
    description: error.description,
  };

  // Log the user id who makes this request based on the API session token
  if (request.user) {
    ctx.user_id = request.user.userId || request.user.username || null;
  }

  // If this error is thrown by our code execution, then also log the stack trance
  if (error.stack) {
    ctx.stack = error.stack;
  }

  logger.error(ctx, error.toString());

  return next(error);
});

// Handle library error, e.g. JOI, Sequelize, etc.
app.use(errorHandler);

// Send error response to the caller
app.use((error, request, response, next) =>
  response.status(error.status || 500).json({
    statusCode: error.status || 500,
    error: error.code || 'UNKNOWN_ERROR',
    description: error.description || 'Unknown error',
    message: error.message || 'An error has occurred',
    // Handle JOI validation error
    ...(error.validationErrors && {
      validation_errors: error.validationErrors,
    }),
  })
);

module.exports = app;
