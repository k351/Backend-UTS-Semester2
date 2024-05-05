const transactionsRepository = require('./transactions-repository');
const {getUser} = require("../users/users-repository");

/**
 * Create new user
 * @param {string} user_id 
 * @param {string} receiver_id
 * @param {Number} amount 
 * @param {string} description 
 * @param {string} type 
 * @returns {boolean}
 */

async function createTransaction(user_id, receiver_id, amount, description, type) {
  try {
    // Fetch sender and receiver data
    const sender =  await getUser(user_id);
    const receiver =  await getUser(receiver_id);

    if (!sender || !receiver) {
      return null; // Handle case where sender or receiver is not found
    }

    if (sender.balance < amount) {
      return null; // Handle insufficient balance case
    }

    // Update balances
    sender.balance -= amount;
    receiver.balance += amount;

    // Save changes to the database
    await Promise.all([sender.save(), receiver.save()]);

    // Create transaction record
    await transactionsRepository.createTransaction(user_id, receiver_id, amount, description, type);

  } catch (err) {
    return null;
  }

  return true;
}


/**
 * Get Transactio  detail
 * @param {string} id - Transaction ID
 * @param {string} user_id - User ID
 * @returns {Object}
 */
async function getTransactionbyId(id, user_id) {
  const transaction = await transactionsRepository.getTransactionbyId(id);
  const user = await getUser(user_id);

  // User not found
  if (!transaction || (transaction.user_id !== user.id)) {
    return null;
  }

  return {
    transaction_id: transaction.id,
    user_id: transaction.user_id,
    receiver_id: transaction.receiver_id,
    amount: transaction.amount,
    description: transaction.description,
    type: transaction.type,
  };
}

module.exports = {
  createTransaction,
  getTransactionbyId,
}