const Joi = require("joi");
const registerUserSchema = Joi.object({
  email: Joi.string().trim().min(5).max(100).required().email(),
  username: Joi.string().trim().min(2).max(200).required(),
  password: Joi.string().trim().min(8).required(),
});

module.exports = registerUserSchema ;
