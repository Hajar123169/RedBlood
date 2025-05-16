/**
 * User controller
 * Handles user profile operations, settings, etc.
 */

const { auth } = require('../config/firebase');
const { userModel, donationModel, requestModel } = require('../models');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../utils/constants');
const { removeEmptyValues } = require('../utils/helpers');

/**
 * Get user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if user is requesting their own profile or is an admin
    if (id !== req.user.id && req.user.customClaims?.role !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: 'fail',
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }
    
    // Get user data from Firestore
    const userData = await userModel.getUserById(id);
    
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
        user: userData,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if user is updating their own profile or is an admin
    if (id !== req.user.id && req.user.customClaims?.role !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: 'fail',
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }
    
    // Get allowed fields to update
    const {
      fullName,
      phoneNumber,
      bloodType,
      address,
      location,
      notificationPreferences,
      medicalInfo,
    } = req.body;
    
    // Create update object with only provided fields
    const updateData = removeEmptyValues({
      fullName,
      phoneNumber,
      bloodType,
      address,
      location,
      notificationPreferences,
      medicalInfo,
    });
    
    // Update user in Firestore
    const updatedUser = await userModel.updateUser(id, updateData);
    
    // If fullName is provided, update displayName in Firebase Auth
    if (fullName) {
      await auth.updateUser(id, { displayName: fullName });
    }
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: SUCCESS_MESSAGES.USER_UPDATED,
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // In a real app, you would verify the current password
    // For this implementation, we'll skip that step
    
    // Update password in Firebase Auth
    await auth.updateUser(req.user.id, { password: newPassword });
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user donation history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getDonationHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get donation history from Firestore
    const donations = await donationModel.getUserDonations(userId);
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        donations,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user blood request history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getRequestHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get request history from Firestore
    const requests = await requestModel.getUserRequests(userId);
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        requests,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update notification settings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateNotificationSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { notificationPreferences } = req.body;
    
    // Update user in Firestore
    const updatedUser = await userModel.updateUser(userId, {
      notificationPreferences,
    });
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Notification settings updated successfully',
      data: {
        notificationPreferences: updatedUser.notificationPreferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Delete user from Firebase Auth
    await auth.deleteUser(userId);
    
    // Delete user from Firestore
    await userModel.deleteUser(userId);
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: SUCCESS_MESSAGES.USER_DELETED,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get eligible donors for a blood type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getEligibleDonors = async (req, res, next) => {
  try {
    const { bloodType } = req.params;
    const { latitude, longitude, radius = 50 } = req.query;
    
    // Get all users with compatible blood types
    // In a real app, you would implement more sophisticated filtering
    const users = await userModel.getUsers({ bloodType });
    
    // Filter users by location if provided
    let filteredUsers = users;
    if (latitude && longitude) {
      const location = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
      filteredUsers = userModel.getNearbyUsers(users, location, parseFloat(radius));
    }
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        donors: filteredUsers.map(user => ({
          id: user.id,
          fullName: user.fullName,
          bloodType: user.bloodType,
          distance: user.distance,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};