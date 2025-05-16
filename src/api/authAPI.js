import api from './axios';

/**
 * Authentication API service
 * Handles login, registration, password reset, etc.
 */

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - API response
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - API response
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise} - API response
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise} - API response
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise} - API response
 */
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify user email
 * @param {string} token - Verification token
 * @returns {Promise} - API response
 */
export const verifyEmail = async (token) => {
  try {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  } catch (error) {
    throw error;
  }
};