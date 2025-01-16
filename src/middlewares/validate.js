const validate = (schema, target = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[target], { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ errors });
    }
    next();
  };
};

module.exports = validate;
