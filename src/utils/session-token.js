const jwt = require('jsonwebtoken');

const config = require('../core/config');

/**
 * Sign and generate JWT token
 * @param {string} email - Email
 * @param {string} userId - User ID
 * @returns {string} Token
 */
function generateToken(email, userId) {
  // Sign the JWT token with user info and set the expiration date
  return jwt.sign(
    {
      email,
      userId,
    },
    config.secret.jwt,
    {
      expiresIn: config.secret.jwtExpiresIn,
    }
  );
}

module.exports = {
  generateToken,
};
