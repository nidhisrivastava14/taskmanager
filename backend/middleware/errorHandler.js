const logger = require('../utils/logger');

/**
 * Global Error Handler Middleware
 * Normalizes all exceptions into a standard JSON output structure
 */
const errorHandler = (err, req, res, next) => {
  let errorResponse = {
    success: false,
    data: null,
    error: err.message || 'Internal Server Error',
    code: err.code || 'SERVER_ERROR'
  };

  let statusCode = err.statusCode || 500;

  // Log error using our logging utility
  logger.error(`${req.method} ${req.url} failed: ${err.message}`, err);

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    errorResponse.error = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    errorResponse.code = 'DUPLICATE_RESOURCE';
    statusCode = 400;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    errorResponse.error = messages.join(', ');
    errorResponse.code = 'VALIDATION_ERROR';
    statusCode = 400;
  }

  // Mongoose Cast Error (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    errorResponse.error = `Resource not found with id of ${err.value}`;
    errorResponse.code = 'RESOURCE_NOT_FOUND';
    statusCode = 404;
  }

  // Custom App Error format support (e.g. from validators)
  if (err.isOperational) {
    errorResponse.error = err.message;
    errorResponse.code = err.errorCode || 'BAD_REQUEST';
    statusCode = err.statusCode || 400;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
