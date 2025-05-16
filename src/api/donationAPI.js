import api from './axios';

/**
 * Donation API service
 * Handles blood donation operations
 */

/**
 * Get all donation centers
 * @param {Object} params - Query parameters (location, distance, etc.)
 * @returns {Promise} - API response with donation centers
 */
export const getDonationCenters = async (params = {}) => {
  try {
    const response = await api.get('/donations/centers', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get donation center details
 * @param {string} centerId - Donation center ID
 * @returns {Promise} - API response with center details
 */
export const getDonationCenterDetails = async (centerId) => {
  try {
    const response = await api.get(`/donations/centers/${centerId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Schedule a donation appointment
 * @param {Object} appointmentData - Appointment details
 * @returns {Promise} - API response
 */
export const scheduleAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/donations/appointments', appointmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user's upcoming appointments
 * @returns {Promise} - API response with appointments
 */
export const getUpcomingAppointments = async () => {
  try {
    const response = await api.get('/donations/appointments/upcoming');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cancel a donation appointment
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise} - API response
 */
export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await api.delete(`/donations/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reschedule a donation appointment
 * @param {string} appointmentId - Appointment ID
 * @param {Object} newDetails - New appointment details
 * @returns {Promise} - API response
 */
export const rescheduleAppointment = async (appointmentId, newDetails) => {
  try {
    const response = await api.put(`/donations/appointments/${appointmentId}`, newDetails);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get donation eligibility criteria
 * @returns {Promise} - API response with eligibility criteria
 */
export const getEligibilityCriteria = async () => {
  try {
    const response = await api.get('/donations/eligibility');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Check user eligibility for donation
 * @param {Object} userInfo - User health information
 * @returns {Promise} - API response with eligibility status
 */
export const checkEligibility = async (userInfo) => {
  try {
    const response = await api.post('/donations/eligibility/check', userInfo);
    return response.data;
  } catch (error) {
    throw error;
  }
};