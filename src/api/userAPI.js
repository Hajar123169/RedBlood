import api from './axios';

/**
 * User API service
 * Handles user profile operations, settings, etc.
 */

/**
 * Get current user profile
 * @returns {Promise} - API response with user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} userData - User data to update
 * @returns {Promise} - API response
 */
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} - API response
 */
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/users/password', { currentPassword, newPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user donation history
 * @returns {Promise} - API response with donation history
 */
export const getDonationHistory = async () => {
  try {
    const response = await api.get('/users/donations');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user blood request history
 * @returns {Promise} - API response with request history
 */
export const getRequestHistory = async () => {
  try {
    const response = await api.get('/users/requests');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user notification settings
 * @param {Object} settings - Notification settings
 * @returns {Promise} - API response
 */
export const updateNotificationSettings = async (settings) => {
  try {
    const response = await api.put('/users/settings/notifications', settings);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload user profile picture
 * @param {FormData} formData - Form data with image file
 * @returns {Promise} - API response
 */
export const uploadProfilePicture = async (formData) => {
  try {
    const response = await api.post('/users/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};