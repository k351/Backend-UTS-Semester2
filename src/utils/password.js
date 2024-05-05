const bcrypt = require('bcrypt');

/**
 * Hash a plain text password
 * @param {string} password - The password to be hashed
 * @returns {string}
 */
async function hashPassword(password) {
  const saltRounds = 16;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });

  return hashedPassword;
}

/**
 * Compares a plain text password and its hashed to determine its equality
 * Mainly use for comparing login credentials
 * @param {string} password - A plain text password
 * @param {string} hashedPassword - A hashed password
 * @returns {boolean}
 */
async function passwordMatched(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {
  hashPassword,
  passwordMatched,
};
