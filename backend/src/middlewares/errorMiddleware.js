const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  // Prisma unique constraint error
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return sendError(res, 409, `A record with this ${field} already exists.`);
  }

  // Prisma record not found error
  if (err.code === 'P2025') {
    return sendError(res, 404, 'Requested record was not found.');
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, statusCode, message);
};

module.exports = errorHandler;
