const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const { errorResponder, errorTypes } = require('../../../core/errors');
const logger = require("../../../core/logger")("app");

const LOGIN_ATTEMPT_LIMIT = 5; // Maximum number of failed login attempts allowed
const LOGIN_TIMEOUT_DURATION = 30 * 60 * 1000; // Timeout duration in milliseconds (60 minute)

// Define an object to keep track of failed login attempts
const failedLoginAttempts = {};

// Define an object to keep track of blocked users and their blocked time
const blockedUsers = {};

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
    const user = await authenticationRepository.getUserByEmail(email);
    let loginSuccess = false;

    // Check if the user is already blocked
    const lastBlockedTime = getLastBlockedTime(email);
    if (lastBlockedTime && Date.now() - lastBlockedTime < LOGIN_TIMEOUT_DURATION) {
        logger.info(`${user.name} ${user.email} Tried to login. User is temporarily blocked.`);

        throw errorResponder(errorTypes.FORBIDDEN, "Forbidden: Too many failed login Attempt");
    }

    // Check if the user exists and the password matches
    if (!user || !(await passwordMatched(password, user.password))) {
        const attempts = getFailedLoginAttempts(email);

        // Increment attempts only if it's not already at the limit
        if (attempts < LOGIN_ATTEMPT_LIMIT) {
            incrementFailedLoginAttempts(email);
        }

        // If attempts exceed the limit, block the user
        if (attempts + 1 >= LOGIN_ATTEMPT_LIMIT) {
            blockUser(email);

            // Schedule unblocking of the user after the specified timeout duration
            setTimeout(() => {
                unblockUser(user.name, email)
                resetFailedLoginAttempts(email) // Reset the attempt count after unblocking
            }, LOGIN_TIMEOUT_DURATION) // Unblock the user after 30 minutes

        }

        if(attempts === 4 ){
            logger.info(`${user ? user.name : 'Unknown user'} ${email} failed login. Attempt = ${attempts + 1}. Max Limit Reached`);
        }
        else {
            logger.info(`${user ? user.name : 'Unknown user'} ${email} failed login. Attempt = ${attempts + 1}.`);
        }
        throw errorResponder(errorTypes.INVALID_CREDENTIALS, "Password or email is wrong")
    } 
    else {
        // Reset attempts and mark login as success
        resetFailedLoginAttempts(email);
        loginSuccess = true;
        logger.info(`${user.name} ${user.email} successfully logged in.`);
    }

    // If login is successful, generate token
    if (loginSuccess) {
        const userName = user ? user.name : "";
        return {
            email: email,
            name: userName,
            user_id: user ? user.id : null,
            token: generateToken(email, user.id),
        };
    }

    return null;
}

/**
 * Increment failed login attempts for the given email using object
 * @param {string} email - Email address
 */
function incrementFailedLoginAttempts(email) {
    failedLoginAttempts[email] = (failedLoginAttempts[email] || 0) + 1;
}

/**
 * Get the number of failed login attempts for the given email
 * @param {string} email - Email address
 * @returns {number} Number of failed login attempts
 */
function getFailedLoginAttempts(email) {
    return failedLoginAttempts[email] || 0;
}

/**
 * Reset failed login attempts counter for the given email
 * @param {string} email - Email address
 */
function resetFailedLoginAttempts(email) {
    delete failedLoginAttempts[email];
}

/**
 * Block the user by saving the time when the user was blocked
 * @param {string} email - Email address
 */
function blockUser(email) {
    blockedUsers[email] = Date.now();
}

/**
 * Unblock the user by removing the blocked time entry
 * @param {string} userName - user name 
 * @param {string} email - Email address
**/
function unblockUser(userName, email) {
    logger.info(`${userName ? userName : 'Unknown user'} ${email} can try logging in again because it has been more than 30 minutes since the limit was applied. 
                Attempt count is reset to 0.`);
    delete blockedUsers[email];
}


/**
 * Get the last blocked time for the user
 * @param {string} email - Email address
 * @returns {number | undefined} Last blocked time in milliseconds or undefined if the user is not blocked
 */
function getLastBlockedTime(email) {
    return blockedUsers[email];
}

module.exports = {
    checkLoginCredentials,
};
