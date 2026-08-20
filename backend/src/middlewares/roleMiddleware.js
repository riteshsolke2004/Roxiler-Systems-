const { sendError } = require('../utils/response');

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized authentication required.');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 403, `Forbidden access. Required role: ${allowedRoles.join(' or ')}.`);
    }

    next();
  };
};

module.exports = authorizeRoles;
