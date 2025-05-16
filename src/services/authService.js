/**
 * Authentication service for the RedBlood app
 * Handles authentication logic and token management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';
import * as authAPI from '../api/authAPI';

/**
 * Save authentication token to storage
 * @param {string} token - JWT token
 * @returns {Promise<void>}
 */
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error saving auth token:', error);
    throw error;
  }
};

/**
 * Get authentication token from storage
 * @returns {Promise<string|null>} - JWT token or null if not found
 */
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Remove authentication token from storage
 * @returns {Promise<void>}
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error removing auth token:', error);
    throw error;
  }
};

/**
 * Save user data to storage
 * @param {Object} userData - User data object
 * @returns {Promise<void>}
 */
export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

/**
 * Get user data from storage
 * @returns {Promise<Object|null>} - User data object or null if not found
 */
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Remove user data from storage
 * @returns {Promise<void>}
 */
export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  } catch (error) {
    console.error('Error removing user data:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} - True if user is authenticated
 */
export const isAuthenticated = async () => {
  const token = await getToken();
  return !!token;
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - User data
 */
export const login = async (email, password) => {
  try {
    const response = await authAPI.login(email, password);
    
    // Save token and user data
    await saveToken(response.token);
    await saveUserData(response.user);
    
    return response.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - User data
 */
export const register = async (userData) => {
  try {
    const response = await authAPI.register(userData);
    
    // If registration returns a token, save it and user data
    if (response.token) {
      await saveToken(response.token);
      await saveUserData(response.user);
    }
    
    return response.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    // Call logout API
    await authAPI.logout();
  } catch (error) {
    console.error('Logout API error:', error);
    // Continue with local logout even if API call fails
  } finally {
    // Remove token and user data
    await removeToken();
    await removeUserData();
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export const forgotPassword = async (email) => {
  try {
    await authAPI.forgotPassword(email);
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const resetPassword = async (token, newPassword) => {
  try {
    await authAPI.resetPassword(token, newPassword);
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

/**
 * Verify email with token
 * @param {string} token - Verification token
 * @returns {Promise<void>}
 */
export const verifyEmail = async (token) => {
  try {
    await authAPI.verifyEmail(token);
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};