/**
 * Data formatting utilities for the RedBlood app
 */

/**
 * Formats a date to a readable string
 * @param {Date} date - Date to format
 * @param {string} format - Format type ('short', 'medium', 'long', 'relative')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'medium') => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  
  switch (format) {
    case 'short':
      // e.g., 01/15/2023
      return date.toLocaleDateString();
      
    case 'medium':
      // e.g., Jan 15, 2023
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
    case 'long':
      // e.g., January 15, 2023, 2:30 PM
      return date.toLocaleDateString(undefined, { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
      
    case 'relative':
      // e.g., 2 hours ago, 3 days ago, etc.
      return getRelativeTimeString(date);
      
    default:
      return date.toLocaleDateString();
  }
};

/**
 * Formats a time to a readable string
 * @param {Date} date - Date containing the time to format
 * @param {boolean} includeSeconds - Whether to include seconds
 * @returns {string} - Formatted time string
 */
export const formatTime = (date, includeSeconds = false) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  
  if (includeSeconds) {
    options.second = 'numeric';
  }
  
  return date.toLocaleTimeString(undefined, options);
};

/**
 * Formats a phone number
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    // US format: (XXX) XXX-XXXX
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length > 10) {
    // International format
    return `+${cleaned.slice(0, cleaned.length - 10)} ${formatPhoneNumber(cleaned.slice(-10))}`;
  }
  
  // Return original if can't format
  return phone;
};

/**
 * Formats a blood type
 * @param {string} bloodType - Blood type to format
 * @returns {string} - Formatted blood type
 */
export const formatBloodType = (bloodType) => {
  if (!bloodType) return '';
  
  // Ensure proper formatting (e.g., "a+" becomes "A+")
  const type = bloodType.toUpperCase();
  
  // Add proper spacing for display if needed
  return type.replace(/([ABO])([+-])/, '$1 $2');
};

/**
 * Truncates text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add when truncated
 * @returns {string} - Truncated text
 */
export const truncateText = (text, length = 50, suffix = '...') => {
  if (!text) return '';
  
  if (text.length <= length) {
    return text;
  }
  
  return text.substring(0, length).trim() + suffix;
};

/**
 * Formats a name (capitalizes first letter of each word)
 * @param {string} name - Name to format
 * @returns {string} - Formatted name
 */
export const formatName = (name) => {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Gets a relative time string (e.g., "2 hours ago")
 * @param {Date} date - Date to get relative time for
 * @returns {string} - Relative time string
 */
const getRelativeTimeString = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);
  
  if (diffSec < 60) {
    return diffSec + ' second' + (diffSec !== 1 ? 's' : '') + ' ago';
  } else if (diffMin < 60) {
    return diffMin + ' minute' + (diffMin !== 1 ? 's' : '') + ' ago';
  } else if (diffHour < 24) {
    return diffHour + ' hour' + (diffHour !== 1 ? 's' : '') + ' ago';
  } else if (diffDay < 30) {
    return diffDay + ' day' + (diffDay !== 1 ? 's' : '') + ' ago';
  } else if (diffMonth < 12) {
    return diffMonth + ' month' + (diffMonth !== 1 ? 's' : '') + ' ago';
  } else {
    return diffYear + ' year' + (diffYear !== 1 ? 's' : '') + ' ago';
  }
};