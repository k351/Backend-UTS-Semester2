const transactionsService = require("./transactions-service")
const { errorResponder, errorTypes } = require('../../../core/errors');

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

module.exports = {
  createTransaction,
}