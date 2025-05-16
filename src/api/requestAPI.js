import api from './axios';

/**
 * Blood Request API service
 * Handles blood request operations
 */

/**
 * Create a new blood request
 * @param {Object} requestData - Blood request details
 * @returns {Promise} - API response
 */
export const createBloodRequest = async (requestData) => {
  try {
    const response = await api.post('/requests', requestData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all blood requests
 * @param {Object} params - Query parameters (blood type, location, etc.)
 * @returns {Promise} - API response with blood requests
 */
export const getBloodRequests = async (params = {}) => {
  try {
    const response = await api.get('/requests', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get blood request details
 * @param {string} requestId - Request ID
 * @returns {Promise} - API response with request details
 */
export const getBloodRequestDetails = async (requestId) => {
  try {
    const response = await api.get(`/requests/${requestId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update blood request
 * @param {string} requestId - Request ID
 * @param {Object} updateData - Updated request data
 * @returns {Promise} - API response
 */
export const updateBloodRequest = async (requestId, updateData) => {
  try {
    const response = await api.put(`/requests/${requestId}`, updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete blood request
 * @param {string} requestId - Request ID
 * @returns {Promise} - API response
 */
export const deleteBloodRequest = async (requestId) => {
  try {
    const response = await api.delete(`/requests/${requestId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Respond to a blood request
 * @param {string} requestId - Request ID
 * @param {Object} responseData - Response details
 * @returns {Promise} - API response
 */
export const respondToRequest = async (requestId, responseData) => {
  try {
    const response = await api.post(`/requests/${requestId}/respond`, responseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get nearby blood requests
 * @param {Object} locationData - User location data
 * @param {number} radius - Search radius in kilometers
 * @returns {Promise} - API response with nearby requests
 */
export const getNearbyRequests = async (locationData, radius = 10) => {
  try {
    const response = await api.post('/requests/nearby', { ...locationData, radius });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark a blood request as fulfilled
 * @param {string} requestId - Request ID
 * @returns {Promise} - API response
 */
export const markRequestFulfilled = async (requestId) => {
  try {
    const response = await api.put(`/requests/${requestId}/fulfill`);
    return response.data;
  } catch (error) {
    throw error;
  }
};