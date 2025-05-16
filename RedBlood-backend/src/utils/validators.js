/**
 * Data validation utilities for the RedBlood app
 */

/**
 * Validates an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid flag and error message
 */
const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validates a phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if phone number is valid
 */
const isValidPhone = (phone) => {
  // Basic phone validation - can be adjusted for specific country formats
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates a name (first name, last name)
 * @param {string} name - Name to validate
 * @returns {boolean} - True if name is valid
 */
const isValidName = (name) => {
  if (!name || name.trim().length < 2) {
    return false;
  }
  
  // Check if name contains only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[A-Za-z\s'-]+$/;
  return nameRegex.test(name);
};

/**
 * Validates a blood type
 * @param {string} bloodType - Blood type to validate
 * @returns {boolean} - True if blood type is valid
 */
const isValidBloodType = (bloodType) => {
  const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return validBloodTypes.includes(bloodType);
};

/**
 * Validates a date of birth
 * @param {Date} dob - Date of birth to validate
 * @returns {boolean} - True if date of birth is valid
 */
const isValidDateOfBirth = (dob) => {
  if (!dob || !(dob instanceof Date) || isNaN(dob.getTime())) {
    return false;
  }
  
  const now = new Date();
  const minAge = 18; // Minimum age to donate blood
  const maxAge = 65; // Maximum age to donate blood
  
  // Calculate age
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  
  return age >= minAge && age <= maxAge;
};

/**
 * Validates a date string
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} - True if date string is valid
 */
const isValidDateString = (dateStr) => {
  if (!dateStr) return false;
  
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

/**
 * Validates a URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if URL is valid
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validates a latitude value
 * @param {number} lat - Latitude to validate
 * @returns {boolean} - True if latitude is valid
 */
const isValidLatitude = (lat) => {
  return !isNaN(lat) && lat >= -90 && lat <= 90;
};

/**
 * Validates a longitude value
 * @param {number} lon - Longitude to validate
 * @returns {boolean} - True if longitude is valid
 */
const isValidLongitude = (lon) => {
  return !isNaN(lon) && lon >= -180 && lon <= 180;
};

/**
 * Validates a location object
 * @param {Object} location - Location object with latitude and longitude
 * @returns {boolean} - True if location is valid
 */
const isValidLocation = (location) => {
  if (!location || typeof location !== 'object') {
    return false;
  }
  
  return isValidLatitude(location.latitude) && isValidLongitude(location.longitude);
};

/**
 * Validates an address object
 * @param {Object} address - Address object
 * @returns {boolean} - True if address is valid
 */
const isValidAddress = (address) => {
  if (!address || typeof address !== 'object') {
    return false;
  }
  
  // Check if at least city and country are provided
  return !!address.city && !!address.country;
};

/**
 * Validates a donation type
 * @param {string} donationType - Donation type to validate
 * @returns {boolean} - True if donation type is valid
 */
const isValidDonationType = (donationType) => {
  const validTypes = ['whole_blood', 'plasma', 'platelets', 'double_red_cells'];
  return validTypes.includes(donationType);
};

/**
 * Validates a request urgency level
 * @param {string} urgency - Urgency level to validate
 * @returns {boolean} - True if urgency level is valid
 */
const isValidUrgency = (urgency) => {
  const validLevels = ['low', 'medium', 'high', 'critical'];
  return validLevels.includes(urgency);
};

/**
 * Validates a request status
 * @param {string} status - Status to validate
 * @returns {boolean} - True if status is valid
 */
const isValidRequestStatus = (status) => {
  const validStatuses = ['pending', 'active', 'fulfilled', 'cancelled', 'expired'];
  return validStatuses.includes(status);
};

/**
 * Validates a donation status
 * @param {string} status - Status to validate
 * @returns {boolean} - True if status is valid
 */
const isValidDonationStatus = (status) => {
  const validStatuses = ['scheduled', 'completed', 'cancelled', 'no_show', 'deferred'];
  return validStatuses.includes(status);
};

/**
 * Validates a response status
 * @param {string} status - Status to validate
 * @returns {boolean} - True if status is valid
 */
const isValidResponseStatus = (status) => {
  const validStatuses = ['pending', 'accepted', 'rejected', 'cancelled'];
  return validStatuses.includes(status);
};

module.exports = {
  isValidEmail,
  validatePassword,
  isValidPhone,
  isValidName,
  isValidBloodType,
  isValidDateOfBirth,
  isValidDateString,
  isValidUrl,
  isValidLatitude,
  isValidLongitude,
  isValidLocation,
  isValidAddress,
  isValidDonationType,
  isValidUrgency,
  isValidRequestStatus,
  isValidDonationStatus,
  isValidResponseStatus,
};