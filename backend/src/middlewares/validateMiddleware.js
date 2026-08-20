const { sendError } = require('../utils/response');

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.errors) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      const firstMessage = errorMessages[0]?.message || 'Validation failed';
      return sendError(res, 400, firstMessage, errorMessages);
    }
    return sendError(res, 400, 'Validation failed');
  }
};

module.exports = validate;
