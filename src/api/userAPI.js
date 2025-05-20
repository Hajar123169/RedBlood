import api from './axios';

/**
 * User API service
 * Handles user profile operations, settings, etc.
 */

// Mock user data
const MOCK_USER = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'user@redblood.com',
  bloodType: 'O+',
  phone: '+1234567890',
  address: '123 Main St, City',
  role: 'donor',
  createdAt: '2023-01-01T00:00:00.000Z'
};

// Mock donation history
const MOCK_DONATIONS = [
  { 
    id: '1', 
    date: '2023-05-15', 
    location: 'Central Blood Bank', 
    type: 'Whole Blood',
    amount: '450ml',
    status: 'Completed'
  },
  { 
    id: '2', 
    date: '2023-01-10', 
    location: 'City Hospital', 
    type: 'Plasma',
    amount: '500ml',
    status: 'Completed'
  }
];

// Mock blood requests
const MOCK_REQUESTS = [
  {
    id: '1',
    bloodType: 'A+',
    hospital: 'Memorial Hospital',
    urgency: 'High',
    date: '2023-06-20',
    status: 'Fulfilled'
  },
  {
    id: '2',
    bloodType: 'O-',
    hospital: 'Children\'s Medical Center',
    urgency: 'Critical',
    date: '2023-07-15',
    status: 'Pending'
  }
];

/**
 * Get current user profile
 * @returns {Promise} - API response with user data
 */
export const getCurrentUser = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return mock user data
  return MOCK_USER;
};

/**
 * Update user profile
 * @param {Object} userData - User data to update
 * @returns {Promise} - API response
 */
export const updateProfile = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return updated user data
  return { ...MOCK_USER, ...userData };
};

/**
 * Update user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} - API response
 */
export const updatePassword = async (currentPassword, newPassword) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Validate current password
  if (currentPassword !== 'Blood123!') {
    const error = new Error('Current password is incorrect');
    error.response = { status: 400, data: { message: 'Current password is incorrect' } };
    throw error;
  }

  // Return success response
  return { success: true, message: 'Password updated successfully' };
};

/**
 * Get user donation history
 * @returns {Promise} - API response with donation history
 */
export const getDonationHistory = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return mock donation history
  return MOCK_DONATIONS;
};

/**
 * Get user blood request history
 * @returns {Promise} - API response with request history
 */
export const getRequestHistory = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return mock request history
  return MOCK_REQUESTS;
};

/**
 * Update user notification settings
 * @param {Object} settings - Notification settings
 * @returns {Promise} - API response
 */
export const updateNotificationSettings = async (settings) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return success response
  return { 
    success: true, 
    message: 'Notification settings updated successfully',
    settings
  };
};

/**
 * Upload user profile picture
 * @param {FormData} formData - Form data with image file
 * @returns {Promise} - API response
 */
export const uploadProfilePicture = async (formData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return mock response with fake image URL
  return { 
    success: true, 
    message: 'Profile picture uploaded successfully',
    imageUrl: 'https://example.com/profile-pictures/user-1.jpg'
  };
};

/**
 * Get nearby blood donors
 * @param {string} bloodType - Blood type to search for
 * @param {Object} location - User location (latitude, longitude)
 * @returns {Promise} - API response with nearby donors
 */
export const getNearbyDonors = async (bloodType, location) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Mock nearby donors data
  const MOCK_NEARBY_DONORS = [
    {
      id: '101',
      firstName: 'Alice',
      lastName: 'Johnson',
      bloodType: 'A+',
      distance: '1.2 km',
      lastDonation: '2023-04-10'
    },
    {
      id: '102',
      firstName: 'Robert',
      lastName: 'Smith',
      bloodType: 'O+',
      distance: '2.5 km',
      lastDonation: '2023-03-22'
    },
    {
      id: '103',
      firstName: 'Emily',
      lastName: 'Brown',
      bloodType: 'B-',
      distance: '3.7 km',
      lastDonation: '2023-05-05'
    },
    {
      id: '104',
      firstName: 'Michael',
      lastName: 'Davis',
      bloodType: 'AB+',
      distance: '4.1 km',
      lastDonation: '2023-02-18'
    }
  ];

  // Filter by blood type if provided
  const donors = bloodType 
    ? MOCK_NEARBY_DONORS.filter(donor => donor.bloodType === bloodType)
    : MOCK_NEARBY_DONORS;

  return donors;
};
