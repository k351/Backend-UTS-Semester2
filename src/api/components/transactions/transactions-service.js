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

module.exports = {
  createTransaction,
}