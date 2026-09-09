const Joi = require("joi");
const createBookSchema = Joi.object({
  title: Joi.string().trim().min(3).max(30).required(),
  description: Joi.string().trim().min(5).required(),
  authorId: Joi.string().required(),
  price: Joi.number().min(0).required(),
  cover: Joi.string().valid("soft cover", "hard cover").required(),
});

module.exports =  createBookSchema ;
