const Joi = require("joi");
const updateUserSchema = Joi.object({
  email: Joi.string().trim().min(5).max(100).email(),
  username: Joi.string().trim().min(2).max(200),
  password: Joi.string().trim().min(6),
});

module.exports = updateUserSchema ;
