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
    "number.base": "User id should be a number",
    "number.min": "User id should be at least 1",
    "any.required": "User id is required",
  }),
  userName: Joi.string().min(3).max(50).required().messages({
    "string.min": "User name should have at least 3 characters",
    "string.max": "User name should not exceed 50 characters",
    "any.required": "User name is required",
  }),
});

module.exports = { createEventSchema, bookEventSchema };
