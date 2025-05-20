import api from './axios';

/**
 * Authentication API service
 * Handles login, registration, password reset, etc.
 */

// Static credentials for user authentication
const STATIC_CREDENTIALS = {
  email: 'user@redblood.com',
  password: 'Blood123!'
};

// Mock user data
const MOCK_USER = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: STATIC_CREDENTIALS.email,
  bloodType: 'O+',
  phone: '+1234567890',
  address: '123 Main St, City',
  role: 'donor',
  createdAt: '2023-01-01T00:00:00.000Z'
};

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - API response
 */
export const login = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validate credentials
  if (email === STATIC_CREDENTIALS.email && password === STATIC_CREDENTIALS.password) {
    // Return mock successful response
    return {
      token: 'mock-jwt-token',
      user: MOCK_USER
    };
  } else {
    // Throw error for invalid credentials
    const error = new Error('Invalid email or password');
    error.response = { status: 401, data: { message: 'Invalid email or password' } };
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - API response
 */
export const register = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validate email is not already taken
  if (userData.email === STATIC_CREDENTIALS.email) {
    const error = new Error('Email already in use');
    error.response = { status: 400, data: { message: 'Email already in use' } };
    throw error;
  }

  // Validate required fields
  const requiredFields = ['firstName', 'lastName', 'email', 'password'];
  for (const field of requiredFields) {
    if (!userData[field]) {
      const error = new Error(`${field} is required`);
      error.response = { status: 400, data: { message: `${field} is required` } };
      throw error;
    }
  }

  // Validate password strength
  if (userData.password.length < 8) {
    const error = new Error('Password must be at least 8 characters long');
    error.response = { status: 400, data: { message: 'Password must be at least 8 characters long' } };
    throw error;
  }

  // Return mock successful response
  return {
    token: 'mock-jwt-token',
    user: {
      id: '2', // Different ID from the static user
      ...userData,
      role: 'donor',
      createdAt: new Date().toISOString()
    }
  };
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise} - API response
 */
export const forgotPassword = async (email) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validate email exists
  if (email !== STATIC_CREDENTIALS.email) {
    const error = new Error('Email not found');
    error.response = { status: 404, data: { message: 'Email not found' } };
    throw error;
  }

  // Return mock successful response
  return {
    success: true,
    message: 'Password reset instructions sent to your email'
  };
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise} - API response
 */
export const resetPassword = async (token, newPassword) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validate token
  if (!token || token !== 'valid-reset-token') {
    const error = new Error('Invalid or expired token');
    error.response = { status: 400, data: { message: 'Invalid or expired token' } };
    throw error;
  }

  // Validate password strength
  if (newPassword.length < 8) {
    const error = new Error('Password must be at least 8 characters long');
    error.response = { status: 400, data: { message: 'Password must be at least 8 characters long' } };
    throw error;
  }

  // Return mock successful response
  return {
    success: true,
    message: 'Password reset successful'
  };
};

/**
 * Logout user
 * @returns {Promise} - API response
 */
export const logout = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return mock successful response
  return {
    success: true,
    message: 'Logged out successfully'
  };
};

/**
 * Verify user email
 * @param {string} token - Verification token
 * @returns {Promise} - API response
 */
export const verifyEmail = async (token) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validate token
  if (!token || token !== 'valid-verification-token') {
    const error = new Error('Invalid or expired token');
    error.response = { status: 400, data: { message: 'Invalid or expired token' } };
    throw error;
  }

  // Return mock successful response
  return {
    success: true,
    message: 'Email verified successfully'
  };
};
