const Joi = require('joi');

const validateLeave = (req, res, next) => {
  const schema = Joi.object({
    leave_type_id: Joi.number().required(),
    from_date: Joi.date().required(),
    to_date: Joi.date().required(),
    reason: Joi.string().min(5).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = { validateLeave, validateLogin };