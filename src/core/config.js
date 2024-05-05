const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default.
process.env.NODE_ENV = (process.env.NODE_ENV || 'development').toLowerCase();

// Environment variables should be saved in a file named `.env` in the `./config` directory.
// See `.env.example` for example.
const envFound = dotenv.config({ path: '.env' });
if (envFound.error) {
  throw new Error("⚠️ Couldn't find .env file ⚠️");
}

module.exports = {
  api: {
    prefix: '/api',
  },
  database: {
    connection: process.env.DB_CONNECTION,
    name: process.env.DB_NAME,
  },
  env: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  secret: {
    jwt: process.env.JWT_SECRET || 'JWT_SECRET',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};
