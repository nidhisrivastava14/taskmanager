/**
 * Custom AppError Class
 * Used to throw expected operational errors that can be processed by the global error handler
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode || 'BAD_REQUEST';
    this.isOperational = true; // Indicates this error is expected/operational

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
