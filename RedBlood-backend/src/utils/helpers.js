/**
 * Helper utility functions for the RedBlood app
 */

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} - Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} deg - Degrees
 * @returns {number} - Radians
 */
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} - Random string
 */
const generateRandomString = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

/**
 * Format date to ISO string without milliseconds
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
const formatDate = (date) => {
  if (!date) return null;
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return date.toISOString().split('.')[0] + 'Z';
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param {any} value - Value to check
 * @returns {boolean} - True if value is empty
 */
const isEmpty = (value) => {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true;
  }
  
  return false;
};

/**
 * Remove empty values from an object
 * @param {Object} obj - Object to clean
 * @returns {Object} - Cleaned object
 */
const removeEmptyValues = (obj) => {
  const result = {};
  
  Object.keys(obj).forEach(key => {
    if (!isEmpty(obj[key])) {
      result[key] = obj[key];
    }
  });
  
  return result;
};

/**
 * Paginate an array
 * @param {Array} array - Array to paginate
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @returns {Object} - Pagination result
 */
const paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const results = {
    data: array.slice(startIndex, endIndex),
    pagination: {
      total: array.length,
      page,
      limit,
      pages: Math.ceil(array.length / limit),
    },
  };
  
  if (startIndex > 0) {
    results.pagination.prev = page - 1;
  }
  
  if (endIndex < array.length) {
    results.pagination.next = page + 1;
  }
  
  return results;
};

/**
 * Get the current timestamp
 * @returns {number} - Current timestamp in milliseconds
 */
const getTimestamp = () => {
  return Date.now();
};

/**
 * Convert a Firestore timestamp to a JavaScript Date
 * @param {Object} timestamp - Firestore timestamp
 * @returns {Date} - JavaScript Date
 */
const timestampToDate = (timestamp) => {
  if (!timestamp) return null;
  
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  return new Date(timestamp);
};

/**
 * Sanitize a string for use in a URL
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
const slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

module.exports = {
  calculateDistance,
  deg2rad,
  generateRandomString,
  formatDate,
  isEmpty,
  removeEmptyValues,
  paginate,
  getTimestamp,
  timestampToDate,
  slugify,
};