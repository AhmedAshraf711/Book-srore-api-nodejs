const Joi = require("joi");
const updateBookSchema = Joi.object({
  title: Joi.string().trim().min(3).max(30),
  description: Joi.string().trim().min(5),
  authorId: Joi.string(),
  price: Joi.number().min(0),
  cover: Joi.string().valid("soft cover", "hard cover"),
});

module.exports =  updateBookSchema ;
