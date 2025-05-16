/**
 * User routes
 */

const express = require('express');
const { userController } = require('../controllers');
const { validate, schemas } = require('../middlewares/validation');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user profile
 * @access  private
 */
router.get(
  '/:id',
  validate(schemas.id, 'params'),
  userController.getProfile
);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user profile
 * @access  private
 */
router.put(
  '/:id',
  validate(schemas.id, 'params'),
  validate(schemas.user.update),
  userController.updateProfile
);

/**
 * @route   PUT /api/v1/users/password
 * @desc    Update user password
 * @access  private
 */
router.put(
  '/password',
  validate({
    currentPassword: schemas.auth.login.extract('password'),
    newPassword: schemas.auth.login.extract('password'),
  }),
  userController.updatePassword
);

/**
 * @route   GET /api/v1/users/donations
 * @desc    Get user donation history
 * @access  private
 */
router.get(
  '/donations',
  userController.getDonationHistory
);

/**
 * @route   GET /api/v1/users/requests
 * @desc    Get user blood request history
 * @access  private
 */
router.get(
  '/requests',
  userController.getRequestHistory
);

/**
 * @route   PUT /api/v1/users/notifications
 * @desc    Update notification settings
 * @access  private
 */
router.put(
  '/notifications',
  userController.updateNotificationSettings
);

/**
 * @route   DELETE /api/v1/users
 * @desc    Delete user account
 * @access  private
 */
router.delete(
  '/',
  userController.deleteAccount
);

/**
 * @route   GET /api/v1/users/donors/:bloodType
 * @desc    Get eligible donors for a blood type
 * @access  private
 */
router.get(
  '/donors/:bloodType',
  validate(schemas.id, 'params'),
  userController.getEligibleDonors
);

/**
 * Admin routes
 */

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (admin only)
 * @access  private
 */
router.get(
  '/',
  restrictTo('admin'),
  userController.getProfile
);

module.exports = router;