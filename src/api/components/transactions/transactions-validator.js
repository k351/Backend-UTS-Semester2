const joi = require('joi');

module.exports = {
  createTransaction: {
    body: {
      receiver_id: joi.string().min(24).max(24).required().label('Receiver_id'),
      amount: joi.number().required().label('Amount'),
      description : joi.string().label('Description'),
      type: joi.string().required().label("Type"),
    },
  },
};
