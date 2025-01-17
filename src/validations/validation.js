const Joi = require("joi");

const createEventSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should not exceed 100 characters",
    "any.required": "Name is required",
  }),
  capacity: Joi.number().integer().min(1).required().messages({
    "number.base": "Capacity should be a number",
    "number.min": "Capacity should be at least 1",
    "any.required": "Capacity is required",
  }),
});

const bookEventSchema = Joi.object({
  userId: Joi.number().integer().min(1).required().messages({
    "number.base": "userId should be a number",
    "number.min": "userId should be at least 1",
    "any.required": "userId is required",
  }),
});

module.exports = { createEventSchema, bookEventSchema };
