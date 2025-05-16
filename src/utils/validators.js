/**
 * Form validation utilities for the RedBlood app
 */

/**
 * Validates an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid flag and error message
 */
export const validatePassword = (password) => {
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
export const isValidPhone = (phone) => {
  // Basic phone validation - can be adjusted for specific country formats
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates a name (first name, last name)
 * @param {string} name - Name to validate
 * @returns {boolean} - True if name is valid
 */
export const isValidName = (name) => {
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
export const isValidBloodType = (bloodType) => {
  const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return validBloodTypes.includes(bloodType);
};

/**
 * Validates a date of birth
 * @param {Date} dob - Date of birth to validate
 * @returns {boolean} - True if date of birth is valid
 */
export const isValidDateOfBirth = (dob) => {
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
 * Validates a form field
 * @param {string} field - Field name
 * @param {any} value - Field value
 * @returns {Object} - Validation result with isValid flag and error message
 */
export const validateField = (field, value) => {
  switch (field) {
    case 'email':
      return {
        isValid: isValidEmail(value),
        message: isValidEmail(value) ? '' : 'Please enter a valid email address',
      };
      
    case 'password':
      return validatePassword(value);
      
    case 'phone':
      return {
        isValid: isValidPhone(value),
        message: isValidPhone(value) ? '' : 'Please enter a valid phone number',
      };
      
    case 'firstName':
    case 'lastName':
      return {
        isValid: isValidName(value),
        message: isValidName(value) ? '' : 'Please enter a valid name',
      };
      
    case 'bloodType':
      return {
        isValid: isValidBloodType(value),
        message: isValidBloodType(value) ? '' : 'Please select a valid blood type',
      };
      
    case 'dob':
      return {
        isValid: isValidDateOfBirth(value),
        message: isValidDateOfBirth(value) ? '' : 'You must be between 18 and 65 years old to donate blood',
      };
      
    default:
      return { isValid: true, message: '' };
  }
};