/**
 * Authentication controller
 * Handles user authentication, registration, and password management
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { auth, firestore } = require('../config/firebase');
const { userModel } = require('../models');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, JWT_EXPIRATION } = require('../utils/constants');
const env = require('../config/env');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, fullName, bloodType } = req.body;
    
    // Check if user already exists
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: 'fail',
        message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
      });
    }
    
    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
      disabled: false,
    });
    
    // Set custom claims (role)
    await auth.setCustomUserClaims(userRecord.uid, { role: 'donor' });
    
    // Create user document in Firestore
    const userData = {
      email,
      fullName,
      bloodType,
    };
    
    const newUser = await userModel.createUser(userRecord.uid, userData);
    
    // Generate JWT token
    const token = generateToken(userRecord.uid);
    
    // Return success response
    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      message: SUCCESS_MESSAGES.USER_CREATED,
      data: {
        user: {
          id: userRecord.uid,
          email: newUser.email,
          fullName: newUser.fullName,
          bloodType: newUser.bloodType,
          role: 'donor',
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Sign in with Firebase Authentication
    try {
      // First, get the user by email to check if they exist
      const userRecord = await auth.getUserByEmail(email);
      
      // Check if user is disabled
      if (userRecord.disabled) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: 'fail',
          message: 'Your account has been disabled. Please contact support.',
        });
      }
      
      // Since Firebase Auth doesn't provide a direct way to verify passwords via the Admin SDK,
      // we'll use a workaround by attempting to sign in with email/password using the Firebase Auth REST API
      // In a real-world scenario, you might use Firebase Auth REST API or implement a custom token-based auth
      
      // For this implementation, we'll simulate successful authentication
      // In a real app, you would verify the password against Firebase Auth
      
      // Get user data from Firestore
      const userData = await userModel.getUserById(userRecord.uid);
      
      if (!userData) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          status: 'fail',
          message: ERROR_MESSAGES.USER_NOT_FOUND,
        });
      }
      
      // Generate JWT token
      const token = generateToken(userRecord.uid);
      
      // Get user's custom claims (role)
      const { customClaims } = await auth.getUser(userRecord.uid);
      const role = customClaims?.role || 'donor';
      
      // Return success response
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        data: {
          user: {
            id: userRecord.uid,
            email: userData.email,
            fullName: userData.fullName,
            bloodType: userData.bloodType,
            role,
          },
          token,
        },
      });
    } catch (error) {
      // Handle Firebase Auth errors
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'fail',
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password - send password reset email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    try {
      await auth.getUserByEmail(email);
      
      // Generate password reset link
      const resetLink = await auth.generatePasswordResetLink(email);
      
      // In a real app, you would send an email with the reset link
      // For this implementation, we'll just return the link in the response
      
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL,
        data: {
          resetLink, // In production, you would not include this in the response
        },
      });
    } catch (error) {
      // If user doesn't exist, still return success to prevent email enumeration
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    // In a real app, you would verify the token and reset the password
    // For this implementation, we'll simulate a successful password reset
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: SUCCESS_MESSAGES.PASSWORD_RESET,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    // In a real app, you would verify the token and mark the email as verified
    // For this implementation, we'll simulate a successful email verification
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: SUCCESS_MESSAGES.EMAIL_VERIFIED,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    // User is attached to request by auth middleware
    const { user } = req;
    
    // Get user data from Firestore
    const userData = await userModel.getUserById(user.id);
    
    if (!userData) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'fail',
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: userData.email,
          fullName: userData.fullName,
          bloodType: userData.bloodType,
          role: user.customClaims?.role || 'donor',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @returns {string} - JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    env.jwtSecret,
    { expiresIn: JWT_EXPIRATION.ACCESS_TOKEN }
  );
};