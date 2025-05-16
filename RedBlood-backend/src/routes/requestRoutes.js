/**
 * Blood Request routes
 */

const express = require('express');
const { requestController } = require('../controllers');
const { validate, schemas } = require('../middlewares/validation');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

// Public routes

/**
 * @route   GET /api/v1/requests
 * @desc    Get all blood requests
 * @access  public
 */
router.get(
  '/',
  requestController.getRequests
);

/**
 * @route   GET /api/v1/requests/:id
 * @desc    Get blood request details
 * @access  public
 */
router.get(
  '/:id',
  validate(schemas.id, 'params'),
  requestController.getRequestDetails
);

/**
 * @route   GET /api/v1/requests/nearby
 * @desc    Get nearby blood requests
 * @access  public
 */
router.get(
  '/nearby',
  requestController.getNearbyRequests
);

// Protected routes - require authentication
router.use(protect);

/**
 * @route   POST /api/v1/requests
 * @desc    Create a new blood request
 * @access  private
 */
router.post(
  '/',
  validate(schemas.request.create),
  requestController.createRequest
);

/**
 * @route   PUT /api/v1/requests/:id
 * @desc    Update a blood request
 * @access  private
 */
router.put(
  '/:id',
  validate(schemas.id, 'params'),
  validate(schemas.request.update),
  requestController.updateRequest
);

/**
 * @route   DELETE /api/v1/requests/:id
 * @desc    Delete a blood request
 * @access  private
 */
router.delete(
  '/:id',
  validate(schemas.id, 'params'),
  requestController.deleteRequest
);

/**
 * @route   POST /api/v1/requests/:id/respond
 * @desc    Respond to a blood request
 * @access  private
 */
router.post(
  '/:id/respond',
  validate(schemas.id, 'params'),
  requestController.respondToRequest
);

/**
 * @route   PUT /api/v1/requests/:id/responses/:responseId
 * @desc    Update a response to a blood request
 * @access  private
 */
router.put(
  '/:id/responses/:responseId',
  validate(schemas.id, 'params'),
  requestController.updateResponse
);

/**
 * @route   PUT /api/v1/requests/:id/fulfill
 * @desc    Mark a blood request as fulfilled
 * @access  private
 */
router.put(
  '/:id/fulfill',
  validate(schemas.id, 'params'),
  requestController.markRequestFulfilled
);

module.exports = router;