/**
 * Blood Request controller
 * Handles blood request operations
 */

const { requestModel, userModel } = require('../models');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, REQUEST_STATUS, BLOOD_COMPATIBILITY } = require('../utils/constants');
const { calculateDistance } = require('../utils/helpers');

/**
 * Create a new blood request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      patientName,
      bloodType,
      units,
      hospital,
      urgency,
      requiredBy,
      contactName,
      contactPhone,
      contactEmail,
      notes,
      location,
      address,
    } = req.body;
    
    // Create request data
    const requestData = {
      userId,
      patientName,
      bloodType,
      units,
      hospital,
      urgency,
      requiredBy: requiredBy ? new Date(requiredBy) : null,
      contactName,
      contactPhone,
      contactEmail,
      notes,
      location,
      address,
      status: REQUEST_STATUS.ACTIVE,
    };
    
    // Create request in Firestore
    const request = await requestModel.createRequest(requestData);
    
    // Return success response
    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      message: SUCCESS_MESSAGES.REQUEST_CREATED,
      data: {
        request,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all blood requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getRequests = async (req, res, next) => {
  try {
    const { bloodType, status, urgency, sortBy, order, latitude, longitude, radius } = req.query;
    
    // Parse filters
    const filters = {};
    if (bloodType) filters.bloodType = bloodType;
    if (status) filters.status = status;
    if (urgency) filters.urgency = urgency;
    if (sortBy) filters.sortBy = sortBy;
    if (order) filters.order = order;
    
    // Parse location
    let location = null;
    if (latitude && longitude) {
      location = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };
    }
    
    // Get requests
    const requests = await requestModel.getRequests(
      filters,
      location,
      radius ? parseFloat(radius) : null
    );
    
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
 * Get blood request details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getRequestDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get request
    const request = await requestModel.getRequestById(id);
    
    if (!request) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'fail',
        message: ERROR_MESSAGES.REQUEST_NOT_FOUND,
      });
    }
    
    // Get responses for this request
    const responses = await requestModel.getRequestResponses(id);
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        request,
        responses,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a blood request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      units,
      urgency,
      requiredBy,
      status,
      notes,
    } = req.body;
    
    // Get request
    const request = await requestModel.getRequestById(id);
    
    if (!request) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'fail',
        message: ERROR_MESSAGES.REQUEST_NOT_FOUND,
      });
    }
    
    // Check if request belongs to user
    if (request.userId !== userId && req.user.customClaims?.role !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: 'fail',
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }
    
    // Create update data
    const updateData = {};
    if (units) updateData.units = units;
    if (urgency) updateData.urgency = urgency;
    if (requiredBy) updateData.requiredBy = new Date(requiredBy);
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    
    // Update request
    const updatedRequest = await requestModel.updateRequest(id, updateData);
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: SUCCESS_MESSAGES.REQUEST_UPDATED,
      data: {
        request: updatedRequest,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a blood request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Get request
    const request = await requestModel.getRequestById(id);
    
    if (!request) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'fail',
        message: ERROR_MESSAGES.REQUEST_NOT_FOUND,
      });
    }
    
    // Check if request belongs to user
    if (request.userId !== userId && req.user.customClaims?.role !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: 'fail',
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }
    
    // Delete request
    await requestModel.deleteRequest(id);
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: SUCCESS_MESSAGES.REQUEST_DELETED,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get nearby blood requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getNearbyRequests = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 50, bloodType } = req.query;
    
    // Validate location
    if (!latitude || !longitude) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'fail',
        message: 'Latitude and longitude are required',
      });
    }
    
    // Parse location
    const location = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
    
    // Parse filters
    const filters = { status: REQUEST_STATUS.ACTIVE };
    
    // If bloodType is provided, filter by compatible blood types
    if (bloodType && BLOOD_COMPATIBILITY[bloodType]) {
      filters.bloodType = bloodType;
    }
    
    // Get nearby requests
    const requests = await requestModel.getRequests(
      filters,
      location,
      parseFloat(radius)
    );
    
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
 * Respond to a blood request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.respondToRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { message, contactInfo, scheduledDate } = req.body;
    
    // Get request
    const request = await requestModel.getRequestById(id);
    
    if (!request) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'fail',
        message: ERROR_MESSAGES.REQUEST_NOT_FOUND,
      });
    }
    
    // Check if request is active
    if (request.status !== REQUEST_STATUS.ACTIVE) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'fail',
        message: 'Cannot respond to a request that is not active',
      });
    }
    
    // Get user data
    const user = await userModel.getUserById(userId);
    
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'fail',
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }
    
    // Check if user's blood type is compatible with request
    if (user.bloodType && !BLOOD_COMPATIBILITY[request.bloodType].includes(user.bloodType)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'fail',
        message: `Your blood type (${user.bloodType}) is not compatible with the requested blood type (${request.bloodType})`,
      });
    }
    
    // Create response data
    const responseData = {
      requestId: id,
      userId,
      message,
      contactInfo: contactInfo || {
        name: user.fullName,
        phone: user.phoneNumber,
        email: user.email,
      },
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
    };
    
    // Create response
    const response = await requestModel.createResponse(responseData);
    
    // Return success response
    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      message: SUCCESS_MESSAGES.RESPONSE_CREATED,
      data: {
        response,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a response to a blood request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateResponse = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id, responseId } = req.params;
    const { status, message, scheduledDate } = req.body;
    
    // Get response
    const response = await requestModel.getResponseById(responseId);
    
    if (!response) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'fail',
        message: ERROR_MESSAGES.RESPONSE_NOT_FOUND,
      });
    }
    
    // Check if response belongs to user or request belongs to user
    const request = await requestModel.getRequestById(id);
    
    if (!request) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'fail',
        message: ERROR_MESSAGES.REQUEST_NOT_FOUND,
      });
    }
    
    const isResponseOwner = response.userId === userId;
    const isRequestOwner = request.userId === userId;
    const isAdmin = req.user.customClaims?.role === 'admin';
    
    if (!isResponseOwner && !isRequestOwner && !isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: 'fail',
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }
    
    // Create update data
    const updateData = {};
    if (status) updateData.status = status;
    if (message) updateData.message = message;
    if (scheduledDate) updateData.scheduledDate = new Date(scheduledDate);
    
    // Update response
    const updatedResponse = await requestModel.updateResponse(responseId, updateData);
    
    // If request owner accepts a response, mark request as fulfilled
    if (isRequestOwner && status === 'accepted') {
      await requestModel.updateRequest(id, {
        status: REQUEST_STATUS.FULFILLED,
        fulfilledBy: response.userId,
      });
    }
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: SUCCESS_MESSAGES.RESPONSE_UPDATED,
      data: {
        response: updatedResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a blood request as fulfilled
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.markRequestFulfilled = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { fulfilledBy } = req.body;
    
    // Get request
    const request = await requestModel.getRequestById(id);
    
    if (!request) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'fail',
        message: ERROR_MESSAGES.REQUEST_NOT_FOUND,
      });
    }
    
    // Check if request belongs to user
    if (request.userId !== userId && req.user.customClaims?.role !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: 'fail',
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }
    
    // Update request
    const updatedRequest = await requestModel.updateRequest(id, {
      status: REQUEST_STATUS.FULFILLED,
      fulfilledBy: fulfilledBy || null,
    });
    
    // Return success response
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Blood request marked as fulfilled',
      data: {
        request: updatedRequest,
      },
    });
  } catch (error) {
    next(error);
  }
};