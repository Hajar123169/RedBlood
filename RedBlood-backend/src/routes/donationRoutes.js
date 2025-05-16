/**
 * Donation routes
 */

const express = require('express');
const { donationController } = require('../controllers');
const { validate, schemas } = require('../middlewares/validation');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

// Public routes

/**
 * @route   GET /api/v1/donations/centers
 * @desc    Get all donation centers
 * @access  public
 */
router.get(
  '/centers',
  donationController.getDonationCenters
);

/**
 * @route   GET /api/v1/donations/centers/:id
 * @desc    Get donation center details
 * @access  public
 */
router.get(
  '/centers/:id',
  validate(schemas.id, 'params'),
  donationController.getDonationCenterDetails
);

/**
 * @route   GET /api/v1/donations/eligibility
 * @desc    Get donation eligibility criteria
 * @access  public
 */
router.get(
  '/eligibility',
  donationController.getEligibilityCriteria
);

// Protected routes - require authentication
router.use(protect);

/**
 * @route   POST /api/v1/donations/appointments
 * @desc    Schedule a donation appointment
 * @access  private
 */
router.post(
  '/appointments',
  validate(schemas.donation.create),
  donationController.scheduleAppointment
);

/**
 * @route   GET /api/v1/donations/appointments/upcoming
 * @desc    Get upcoming appointments
 * @access  private
 */
router.get(
  '/appointments/upcoming',
  donationController.getUpcomingAppointments
);

/**
 * @route   PUT /api/v1/donations/appointments/:id
 * @desc    Reschedule a donation appointment
 * @access  private
 */
router.put(
  '/appointments/:id',
  validate(schemas.id, 'params'),
  validate(schemas.donation.update),
  donationController.rescheduleAppointment
);

/**
 * @route   DELETE /api/v1/donations/appointments/:id
 * @desc    Cancel a donation appointment
 * @access  private
 */
router.delete(
  '/appointments/:id',
  validate(schemas.id, 'params'),
  donationController.cancelAppointment
);

/**
 * @route   POST /api/v1/donations/eligibility/check
 * @desc    Check user eligibility for donation
 * @access  private
 */
router.post(
  '/eligibility/check',
  donationController.checkEligibility
);

// Admin routes
router.use(restrictTo('admin'));

/**
 * @route   POST /api/v1/donations/centers
 * @desc    Create a new donation center (admin only)
 * @access  private
 */
router.post(
  '/centers',
  donationController.createDonationCenter
);

/**
 * @route   PUT /api/v1/donations/centers/:id
 * @desc    Update a donation center (admin only)
 * @access  private
 */
router.put(
  '/centers/:id',
  validate(schemas.id, 'params'),
  donationController.updateDonationCenter
);

module.exports = router;