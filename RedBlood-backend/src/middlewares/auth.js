/**
 * Authentication middleware
 */

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { auth } = require('../config/firebase');
const env = require('../config/env');

/**
 * Middleware to protect routes that require authentication
 * Verifies JWT token and attaches user to request object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.protect = async (req, res, next) => {
  try {
    // 1) Get token from Authorization header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.',
      });
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, env.jwtSecret);

    // 3) Check if user still exists
    try {
      const userRecord = await auth.getUser(decoded.id);
      
      // If user is disabled
      if (userRecord.disabled) {
        return res.status(401).json({
          status: 'fail',
          message: 'The user belonging to this token has been disabled.',
        });
      }
      
      // Attach user to request
      req.user = userRecord;
      req.user.id = decoded.id;
      
      next();
    } catch (error) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token. Please log in again.',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your token has expired. Please log in again.',
      });
    }
    
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong with authentication.',
    });
  }
};

/**
 * Middleware to restrict access to certain roles
 * @param  {...string} roles - Allowed roles
 * @returns {Function} Middleware function
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user has required role
    if (!roles.includes(req.user.customClaims?.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }
    
    next();
  };
};

/**
 * Middleware to verify Firebase ID token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.verifyFirebaseToken = async (req, res, next) => {
  try {
    // 1) Get token from Authorization header
    let idToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      idToken = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!idToken) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.',
      });
    }

    // 2) Verify token
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // 3) Attach user to request
    req.user = decodedToken;
    
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};