const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
    return;
  }

  const field = errors.array()[0].param;
  const message = errors.array()[0].msg;
  res.status(422).json({
    ok: false,
    code: "validation_error",
    field: field,
    message: message,
  });
};

module.exports = validate;
