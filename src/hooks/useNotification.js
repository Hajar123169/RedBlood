/**
 * Custom hook for accessing notification services
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as notificationService from '../services/notificationService';

/**
 * Hook to access notification services
 * @param {Object} options - Hook options
 * @param {boolean} options.registerOnMount - Whether to register for notifications on mount
 * @param {boolean} options.handleNotificationResponse - Whether to handle notification responses
 * @returns {Object} Notification data and functions
 */
const useNotification = ({
  registerOnMount = true,
  handleNotificationResponse = true,
} = {}) => {
  const [pushToken, setPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [notificationResponse, setNotificationResponse] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Refs to store notification listeners
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  /**
   * Register for push notifications
   * @returns {Promise<string|null>} - Push token or null if registration failed
   */
  const registerForPushNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await notificationService.registerForPushNotifications();
      
      if (token) {
        setPushToken(token);
        setPermissionStatus('granted');
      } else {
        setPermissionStatus('denied');
      }
      
      return token;
    } catch (error) {
      setError(error.message || 'Failed to register for push notifications');
      setPermissionStatus('error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Schedule a local notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise<string|null>} - Notification ID or null if scheduling failed
   */
  const scheduleNotification = useCallback(async (notificationData) => {
    try {
      setError(null);
      return await notificationService.scheduleLocalNotification(notificationData);
    } catch (error) {
      setError(error.message || 'Failed to schedule notification');
      return null;
    }
  }, []);

  /**
   * Send an immediate local notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise<string|null>} - Notification ID or null if sending failed
   */
  const sendNotification = useCallback(async (notificationData) => {
    try {
      setError(null);
      return await notificationService.sendLocalNotification(notificationData);
    } catch (error) {
      setError(error.message || 'Failed to send notification');
      return null;
    }
  }, []);

  /**
   * Schedule an appointment reminder notification
   * @param {Object} appointment - Appointment data
   * @param {number} minutesBefore - Minutes before appointment to send reminder
   * @returns {Promise<string|null>} - Notification ID or null if scheduling failed
   */
  const scheduleAppointmentReminder = useCallback(async (appointment, minutesBefore = 60) => {
    try {
      setError(null);
      return await notificationService.scheduleAppointmentReminder(appointment, minutesBefore);
    } catch (error) {
      setError(error.message || 'Failed to schedule appointment reminder');
      return null;
    }
  }, []);

  /**
   * Send a blood request notification
   * @param {Object} request - Blood request data
   * @returns {Promise<string|null>} - Notification ID or null if sending failed
   */
  const sendBloodRequestNotification = useCallback(async (request) => {
    try {
      setError(null);
      return await notificationService.sendBloodRequestNotification(request);
    } catch (error) {
      setError(error.message || 'Failed to send blood request notification');
      return null;
    }
  }, []);

  /**
   * Cancel a scheduled notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise<boolean>} - Whether cancellation was successful
   */
  const cancelNotification = useCallback(async (notificationId) => {
    try {
      setError(null);
      await notificationService.cancelNotification(notificationId);
      return true;
    } catch (error) {
      setError(error.message || 'Failed to cancel notification');
      return false;
    }
  }, []);

  /**
   * Cancel all scheduled notifications
   * @returns {Promise<boolean>} - Whether cancellation was successful
   */
  const cancelAllNotifications = useCallback(async () => {
    try {
      setError(null);
      await notificationService.cancelAllNotifications();
      return true;
    } catch (error) {
      setError(error.message || 'Failed to cancel all notifications');
      return false;
    }
  }, []);

  /**
   * Get all scheduled notifications
   * @returns {Promise<Array>} - Array of scheduled notifications
   */
  const getScheduledNotifications = useCallback(async () => {
    try {
      setError(null);
      return await notificationService.getAllScheduledNotifications();
    } catch (error) {
      setError(error.message || 'Failed to get scheduled notifications');
      return [];
    }
  }, []);

  /**
   * Set notification badge count
   * @param {number} count - Badge count
   * @returns {Promise<boolean>} - Whether setting badge count was successful
   */
  const setBadgeCount = useCallback(async (count) => {
    try {
      setError(null);
      await notificationService.setBadgeCount(count);
      return true;
    } catch (error) {
      setError(error.message || 'Failed to set badge count');
      return false;
    }
  }, []);

  /**
   * Get notification badge count
   * @returns {Promise<number>} - Badge count
   */
  const getBadgeCount = useCallback(async () => {
    try {
      setError(null);
      return await notificationService.getBadgeCount();
    } catch (error) {
      setError(error.message || 'Failed to get badge count');
      return 0;
    }
  }, []);

  /**
   * Dismiss all notifications
   * @returns {Promise<boolean>} - Whether dismissal was successful
   */
  const dismissAllNotifications = useCallback(async () => {
    try {
      setError(null);
      await notificationService.dismissAllNotifications();
      return true;
    } catch (error) {
      setError(error.message || 'Failed to dismiss all notifications');
      return false;
    }
  }, []);

  // Register for push notifications on mount
  useEffect(() => {
    if (registerOnMount) {
      registerForPushNotifications();
    }
  }, [registerOnMount, registerForPushNotifications]);

  // Set up notification listeners
  useEffect(() => {
    // Notification received listener
    notificationListener.current = notificationService.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    // Notification response listener (when user taps on notification)
    if (handleNotificationResponse) {
      responseListener.current = notificationService.addNotificationResponseListener(
        (response) => {
          setNotificationResponse(response);
        }
      );
    }

    // Check for any notification that caused the app to open
    const getLastNotificationResponse = async () => {
      const response = await notificationService.getLastNotificationResponse();
      if (response) {
        setNotificationResponse(response);
      }
    };

    if (handleNotificationResponse) {
      getLastNotificationResponse();
    }

    // Clean up listeners on unmount
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [handleNotificationResponse]);

  return {
    pushToken,
    notification,
    notificationResponse,
    permissionStatus,
    loading,
    error,
    registerForPushNotifications,
    scheduleNotification,
    sendNotification,
    scheduleAppointmentReminder,
    sendBloodRequestNotification,
    cancelNotification,
    cancelAllNotifications,
    getScheduledNotifications,
    setBadgeCount,
    getBadgeCount,
    dismissAllNotifications,
  };
};

export default useNotification;