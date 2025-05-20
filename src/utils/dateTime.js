/**
 * Date and time utility functions
 */

import { format, parseISO, formatDistance, addDays, addMonths, isAfter, isBefore, isEqual } from 'date-fns';

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @param {string} formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format a time string to a readable format
 * @param {string} dateString - ISO date string
 * @param {string} formatStr - Format string (default: 'h:mm a')
 * @returns {string} Formatted time string
 */
export const formatTime = (dateString, formatStr = 'h:mm a') => {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

/**
 * Format a date and time string to a readable format
 * @param {string} dateString - ISO date string
 * @param {string} formatStr - Format string (default: 'MMM dd, yyyy h:mm a')
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (dateString, formatStr = 'MMM dd, yyyy h:mm a') => {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return '';
  }
};

/**
 * Get relative time (e.g., "2 days ago", "in 3 hours")
 * @param {string} dateString - ISO date string
 * @param {Date} baseDate - Base date to compare with (default: new Date())
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateString, baseDate = new Date()) => {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return formatDistance(date, baseDate, { addSuffix: true });
  } catch (error) {
    console.error('Error getting relative time:', error);
    return '';
  }
};

/**
 * Add days to a date
 * @param {Date|string} date - Date to add days to
 * @param {number} days - Number of days to add
 * @returns {Date} New date with added days
 */
export const addDaysToDate = (date, days) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return addDays(dateObj, days);
  } catch (error) {
    console.error('Error adding days to date:', error);
    return new Date();
  }
};

/**
 * Add months to a date
 * @param {Date|string} date - Date to add months to
 * @param {number} months - Number of months to add
 * @returns {Date} New date with added months
 */
export const addMonthsToDate = (date, months) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return addMonths(dateObj, months);
  } catch (error) {
    console.error('Error adding months to date:', error);
    return new Date();
  }
};

/**
 * Check if a date is after another date
 * @param {Date|string} date - Date to check
 * @param {Date|string} dateToCompare - Date to compare with
 * @returns {boolean} True if date is after dateToCompare
 */
export const isDateAfter = (date, dateToCompare) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const dateToCompareObj = typeof dateToCompare === 'string' ? parseISO(dateToCompare) : dateToCompare;
    return isAfter(dateObj, dateToCompareObj);
  } catch (error) {
    console.error('Error checking if date is after:', error);
    return false;
  }
};

/**
 * Check if a date is before another date
 * @param {Date|string} date - Date to check
 * @param {Date|string} dateToCompare - Date to compare with
 * @returns {boolean} True if date is before dateToCompare
 */
export const isDateBefore = (date, dateToCompare) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const dateToCompareObj = typeof dateToCompare === 'string' ? parseISO(dateToCompare) : dateToCompare;
    return isBefore(dateObj, dateToCompareObj);
  } catch (error) {
    console.error('Error checking if date is before:', error);
    return false;
  }
};

/**
 * Check if two dates are equal
 * @param {Date|string} date - First date
 * @param {Date|string} dateToCompare - Second date
 * @returns {boolean} True if dates are equal
 */
export const areDatesEqual = (date, dateToCompare) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const dateToCompareObj = typeof dateToCompare === 'string' ? parseISO(dateToCompare) : dateToCompare;
    return isEqual(dateObj, dateToCompareObj);
  } catch (error) {
    console.error('Error checking if dates are equal:', error);
    return false;
  }
};