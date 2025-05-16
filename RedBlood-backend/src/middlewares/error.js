/**
 * Error handling middleware
 */

const env = require('../config/env');

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorMiddleware = (err, req, res, next) => {
  // Set default error values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Different error handling for development and production
  if (env.nodeEnv === 'development') {
    sendDevError(err, res);
  } else {
    // Make a copy of the error to avoid modifying the original
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    // Handle specific error types
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateFieldsError(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendProdError(error, res);
  }
};

/**
 * Send detailed error response in development environment
 * @param {Error} err - Error object
 * @param {Object} res - Express response object
 */
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Send simplified error response in production environment
 * @param {Error} err - Error object
 * @param {Object} res - Express response object
 */
const sendProdError = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } 
  // Programming or other unknown error: don't leak error details
  else {
    // Log error for debugging
    console.error('ERROR 💥', err);
    
    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

/**
 * Handle database cast errors
 * @param {Error} err - Error object
 * @returns {Error} Formatted error
 */
const handleCastError = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return createOperationalError(message, 400);
};

/**
 * Handle duplicate field errors
 * @param {Error} err - Error object
 * @returns {Error} Formatted error
 */
const handleDuplicateFieldsError = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return createOperationalError(message, 400);
};

/**
 * Handle validation errors
 * @param {Error} err - Error object
 * @returns {Error} Formatted error
 */
const handleValidationError = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return createOperationalError(message, 400);
};

/**
 * Handle JWT errors
 * @returns {Error} Formatted error
 */
const handleJWTError = () => {
  return createOperationalError('Invalid token. Please log in again!', 401);
};

/**
 * Handle JWT expired errors
 * @returns {Error} Formatted error
 */
const handleJWTExpiredError = () => {
  return createOperationalError('Your token has expired! Please log in again.', 401);
};

/**
 * Create an operational error
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Error} Operational error
 */
const createOperationalError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  error.isOperational = true;
  return error;
};

module.exports = errorMiddleware;