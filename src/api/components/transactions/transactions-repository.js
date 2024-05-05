const { Transaction } = require('../../../models');

/**
 * Create new user
 * @param {string} user_id 
 * @param {string} receiver_id
 * @param {Number} amount 
 * @param {string} description 
 * @param {string} type 
 * @returns {Promise}
 */
async function createTransaction(user_id, receiver_id, amount, description, type) {
  return Transaction.create({
    user_id,
    receiver_id,
    amount,
    description,
    type,
  });
}

/**
 * Get transaction detail
 * @param {string} id - User ID
 * @returns {Promise}
 **/
async function getTransactionbyId(id) {
  return Transaction.findById(id);
}

module.exports = {
  createTransaction,
  getTransactionbyId,
};
