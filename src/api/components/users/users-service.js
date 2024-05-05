const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

/**
 * Retrieve paginated users from the repository
 * @param {int} page_number - Page number
 * @param {int} page_size - Page size
 * @param {String} searchQuery - Page size
 * @param {String} sortQuery - Page size
 * @returns {Array} - Array of paginated users
 */

async function getUsersPagination(page_number,page_size,searchQuery,sortQuery) {

  page_number = parseInt(page_number);
  page_size = parseInt(page_size);

  let users = await usersRepository.getUsers();

  // Apply searching
  // Extract search field and search key
  const [searchField, searchKey] = searchQuery.split(':');

  // Apply searching
  if (searchField && searchKey) {
    let regex;
    if (searchField === 'name') {
      regex = new RegExp(searchKey, 'i');
      users = users.filter((user) => regex.test(user.name));
    } else if (searchField === 'email') {
      regex = new RegExp(searchKey, 'i');
      users = users.filter((user) => regex.test(user.email));
    }
  }

  // Apply sorting
  if (sortQuery) {
    const [field, order] = sortQuery.split(':');
    users.sort((a, b) => {
      if (order === 'desc') {
        return b[field] > a[field] ? 1 : -1;
      } else if (order === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      }
    });
  }

  // Apply pagination
  if (!users || users.length === 0) {
    return {
      page_number: page_number,
      page_size: page_size,
      count: results.length,
      data: [],
    };
  }

  const startIndex = (page_number - 1) * page_size;
  const endIndex = startIndex + page_size;

  nextPage = false;
  previousPage = false;
  totalPages = Math.ceil(users.length / page_size);

  if (users.length - 1 > endIndex - 1) {
    nextPage = true;
  }
  if (startIndex > 0) {
    previousPage = true;
  }

  const results = [];
  for (let i = startIndex; i < endIndex && i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return {
    page_number: page_number,
    page_size: page_size,
    count: results.length,
    total_pages: totalPages,
    has_previous_page: previousPage,
    has_next_page: nextPage,
    data: results,
  };
}


module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
  getUsersPagination,
};
