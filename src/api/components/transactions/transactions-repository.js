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

/**
 * Update existing user
 * @param {string} id - transaction ID
 * @param {string} receiver_id - receiver_id 
 * @param {Number} amount - amount
 * @returns {Promise}
 **/
async function updateTransaction(id, receiver_id, amount) {
  return Transaction.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        receiver_id: receiver_id,
        amount: amount,
      },
    }
  );
}


/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteTransaction(id) {
  return Transaction.deleteOne({ _id: id });
}

module.exports = {
  createTransaction,
  getTransactionbyId,
  updateTransaction,
  deleteTransaction,
};