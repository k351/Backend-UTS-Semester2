const transactionsService = require("./transactions-service")
const { errorResponder, errorTypes } = require('../../../core/errors');
const {getUser} = require("../users/users-repository");

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createTransaction(request, response, next) {
  try {
    const user_id = request.params.user_id;
    const receiver_id = request.body.receiver_id;
    const amount = request.body.amount;
    const description = request.body.description;
    const type = request.body.type;

    const success = await transactionsService.createTransaction(user_id, receiver_id, amount, description, type);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create transaction'
      );
    }
    else{
      message = "Transaction Success!"
    }

    return response.status(200).json({message});
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getTransactionbyId(request, response, next) {
  try {
    const transaction_id = request.params.id;
    const user_id = request.params.user_id;

    const user = await getUser(user_id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }
    
    const transaction = await transactionsService.getTransactionbyId(transaction_id, user_id);

    if (!transaction) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, "Transaction doesn't exist!");
    }

    return response.status(200).json(transaction);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateTransaction(request, response, next) {
  try {
    const transaction_id = request.params.transaction_id;
    const receiver_id = request.body.receiver_id;
    const amount = request.body.amount;

    const success = await transactionsService.updateTransaction(transaction_id, receiver_id, amount);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update transaction'
      );
    }

    return response.status(200).json(transaction_id);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteTransaction(request, response, next) {
  try {
    const transaction_id = request.params.transaction_id;

    const success = await transactionsService.deleteTransaction(transaction_id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete transaction'
      );
    }

    return response.status(200).json({transaction_id});
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createTransaction,
  getTransactionbyId,
  updateTransaction,
  deleteTransaction
}