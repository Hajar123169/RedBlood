/**
 * Application constants for the RedBlood app
 */

// API version
const API_VERSION = 'v1';

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

// User roles
const USER_ROLES = {
  DONOR: 'donor',
  RECIPIENT: 'recipient',
  ADMIN: 'admin',
  HOSPITAL: 'hospital',
};

// Blood types
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Blood compatibility chart (recipient blood type -> compatible donor types)
const BLOOD_COMPATIBILITY = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'], // Universal donor
};

// Donation types
const DONATION_TYPES = {
  WHOLE_BLOOD: 'whole_blood',
  PLASMA: 'plasma',
  PLATELETS: 'platelets',
  DOUBLE_RED_CELLS: 'double_red_cells',
};

// Donation status
const DONATION_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
  DEFERRED: 'deferred', // Donor was rejected for medical reasons
};

// Request status
const REQUEST_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  FULFILLED: 'fulfilled',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
};

// Request urgency levels
const REQUEST_URGENCY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Response status
const RESPONSE_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

// Donation eligibility
const DONATION_ELIGIBILITY = {
  MIN_AGE: 18,
  MAX_AGE: 65,
  MIN_WEIGHT_KG: 50, // 110 lbs
  MIN_HEMOGLOBIN_MALE: 13.5, // g/dL
  MIN_HEMOGLOBIN_FEMALE: 12.5, // g/dL
  DONATION_INTERVAL_DAYS: 56, // 8 weeks
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// JWT token expiration times
const JWT_EXPIRATION = {
  ACCESS_TOKEN: '1d', // 1 day
  REFRESH_TOKEN: '7d', // 7 days
  RESET_PASSWORD: '1h', // 1 hour
  EMAIL_VERIFICATION: '24h', // 24 hours
};

// Email templates
const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password-reset',
  EMAIL_VERIFICATION: 'email-verification',
  DONATION_REMINDER: 'donation-reminder',
  DONATION_CONFIRMATION: 'donation-confirmation',
  REQUEST_NOTIFICATION: 'request-notification',
  REQUEST_RESPONSE: 'request-response',
};

// Notification types
const NOTIFICATION_TYPES = {
  DONATION_REMINDER: 'donation_reminder',
  DONATION_COMPLETED: 'donation_completed',
  NEW_REQUEST: 'new_request',
  REQUEST_RESPONSE: 'request_response',
  REQUEST_FULFILLED: 'request_fulfilled',
  SYSTEM_NOTIFICATION: 'system_notification',
};

// Error messages
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  USER_NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  INVALID_TOKEN: 'Invalid or expired token',
  SERVER_ERROR: 'Something went wrong on the server',
  VALIDATION_ERROR: 'Validation error',
  RESOURCE_NOT_FOUND: 'Resource not found',
  DONATION_NOT_FOUND: 'Donation not found',
  REQUEST_NOT_FOUND: 'Blood request not found',
  RESPONSE_NOT_FOUND: 'Response not found',
  INVALID_BLOOD_TYPE: 'Invalid blood type',
  INVALID_DONATION_TYPE: 'Invalid donation type',
  INVALID_STATUS: 'Invalid status',
  INVALID_URGENCY: 'Invalid urgency level',
};

// Success messages
const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  PASSWORD_RESET_EMAIL: 'Password reset email sent successfully',
  PASSWORD_RESET: 'Password reset successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  DONATION_CREATED: 'Donation scheduled successfully',
  DONATION_UPDATED: 'Donation updated successfully',
  DONATION_DELETED: 'Donation deleted successfully',
  REQUEST_CREATED: 'Blood request created successfully',
  REQUEST_UPDATED: 'Blood request updated successfully',
  REQUEST_DELETED: 'Blood request deleted successfully',
  RESPONSE_CREATED: 'Response submitted successfully',
  RESPONSE_UPDATED: 'Response updated successfully',
};

// Regex patterns
const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
  PHONE: /^\+?[0-9]{10,15}$/,
  NAME: /^[A-Za-z\s'-]+$/,
};

// Default search radius (in kilometers)
const DEFAULT_SEARCH_RADIUS = 50;

// Maximum file upload size (in bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Allowed file types for uploads
const ALLOWED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

module.exports = {
  API_VERSION,
  HTTP_STATUS,
  USER_ROLES,
  BLOOD_TYPES,
  BLOOD_COMPATIBILITY,
  DONATION_TYPES,
  DONATION_STATUS,
  REQUEST_STATUS,
  REQUEST_URGENCY,
  RESPONSE_STATUS,
  DONATION_ELIGIBILITY,
  PAGINATION,
  JWT_EXPIRATION,
  EMAIL_TEMPLATES,
  NOTIFICATION_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  REGEX_PATTERNS,
  DEFAULT_SEARCH_RADIUS,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
};