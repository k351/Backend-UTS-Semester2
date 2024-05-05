const transactionsSchema = {
  user_id: String,
  receiver_id: String,
  amount: Number,
  description: String,
  type: String,
};

module.exports = transactionsSchema;
