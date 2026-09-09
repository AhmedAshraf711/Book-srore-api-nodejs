const Joi = require("joi");
const loginUserSchema = Joi.object({
  email: Joi.string().trim().min(5).max(100).required().email(),
  password: Joi.string().trim().min(6).required(),
});

module.exports =  loginUserSchema ;