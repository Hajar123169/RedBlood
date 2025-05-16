/**
 * Application constants for the RedBlood app
 */

// API Constants
export const API = {
  BASE_URL: 'https://api.redblood.com/v1', // Replace with actual API URL
  TIMEOUT: 30000, // 30 seconds
  RETRY_COUNT: 3,
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'redblood_auth_token',
  USER_DATA: 'redblood_user_data',
  THEME_PREFERENCE: 'redblood_theme',
  ONBOARDING_COMPLETED: 'redblood_onboarding_completed',
  NOTIFICATION_SETTINGS: 'redblood_notification_settings',
  RECENT_SEARCHES: 'redblood_recent_searches',
};

// Blood Types
export const BLOOD_TYPES = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
];

// Blood Compatibility Chart (recipient blood type -> compatible donor types)
export const BLOOD_COMPATIBILITY = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'], // Universal donor
};

// Donation Eligibility
export const DONATION_ELIGIBILITY = {
  MIN_AGE: 18,
  MAX_AGE: 65,
  MIN_WEIGHT_KG: 50, // 110 lbs
  MIN_HEMOGLOBIN_MALE: 13.5, // g/dL
  MIN_HEMOGLOBIN_FEMALE: 12.5, // g/dL
  DONATION_INTERVAL_DAYS: 56, // 8 weeks
};

// Request Priority Levels
export const REQUEST_PRIORITY = {
  URGENT: 'urgent',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

// Request Status
export const REQUEST_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  FULFILLED: 'fulfilled',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
};

// Donation Status
export const DONATION_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
  DEFERRED: 'deferred', // Donor was rejected for medical reasons
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  DEFAULT: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'You have successfully logged in.',
  REGISTER: 'Your account has been created successfully.',
  PASSWORD_RESET: 'Your password has been reset successfully.',
  PROFILE_UPDATE: 'Your profile has been updated successfully.',
  DONATION_SCHEDULED: 'Your donation appointment has been scheduled successfully.',
  REQUEST_CREATED: 'Your blood request has been created successfully.',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  APPOINTMENT_REMINDER: 'appointment_reminder',
  DONATION_COMPLETED: 'donation_completed',
  NEW_REQUEST: 'new_request',
  REQUEST_MATCHED: 'request_matched',
  REQUEST_FULFILLED: 'request_fulfilled',
};

// App Routes
export const ROUTES = {
  // Auth routes
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  RESET_PASSWORD: 'ResetPassword',
  VERIFY_EMAIL: 'VerifyEmail',
  
  // Main app routes
  HOME: 'Home',
  DONATE: 'Donate',
  REQUESTS: 'Requests',
  PROFILE: 'Profile',
  
  // Donation routes
  DONATION_CENTERS: 'DonationCenters',
  DONATION_CENTER_DETAILS: 'DonationCenterDetails',
  SCHEDULE_DONATION: 'ScheduleDonation',
  DONATION_HISTORY: 'DonationHistory',
  ELIGIBILITY_CHECK: 'EligibilityCheck',
  
  // Request routes
  CREATE_REQUEST: 'CreateRequest',
  REQUEST_DETAILS: 'RequestDetails',
  NEARBY_REQUESTS: 'NearbyRequests',
  MY_REQUESTS: 'MyRequests',
  
  // Profile routes
  EDIT_PROFILE: 'EditProfile',
  SETTINGS: 'Settings',
  NOTIFICATION_SETTINGS: 'NotificationSettings',
  ABOUT: 'About',
  HELP: 'Help',
};

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
  PHONE: /^\+?[0-9]{10,15}$/,
  NAME: /^[A-Za-z\s'-]+$/,
};

// Default Settings
export const DEFAULT_SETTINGS = {
  theme: 'system',
  notifications: {
    appointmentReminders: true,
    donationCompletions: true,
    newRequests: true,
    requestMatches: true,
    requestFulfillments: true,
  },
  radius: 50, // km
  language: 'en',
};

// App Info
export const APP_INFO = {
  NAME: 'RedBlood',
  VERSION: '1.0.0',
  DESCRIPTION: 'Connect blood donors with those in need',
  WEBSITE: 'https://redblood.com',
  EMAIL: 'support@redblood.com',
  PHONE: '+1-800-RED-BLOOD',
};