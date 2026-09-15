const Joi = require("joi");

const validateChangePassword = Joi.object({
    password: Joi.string().trim().min(6).required(),
  });

module.exports = validateChangePassword;