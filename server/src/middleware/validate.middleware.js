const { validationResult } = require('express-validator');
const { sendError } = require('../utils/responseUtils');

const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return sendError(res, {
      statusCode: 422,
      message: 'Validation failed. Please check your input.',
      errors: formattedErrors,
    });
  };
};

module.exports = { validate };
