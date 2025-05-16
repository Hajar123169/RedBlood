/**
 * Notification service for the RedBlood app
 * Handles push notifications and local notifications
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { requestNotificationPermission } from '../utils/permissions';
import { NOTIFICATION_TYPES } from '../utils/constants';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register for push notifications
 * @returns {Promise<string|null>} - Expo push token or null if registration failed
 */
export const registerForPushNotifications = async () => {
  try {
    // Check if device is a physical device (not an emulator)
    if (!Device.isDevice) {
      console.warn('Push notifications are not available on emulators/simulators');
      return null;
    }
    
    // Request permission
    const hasPermission = await requestNotificationPermission();
    
    if (!hasPermission) {
      console.warn('Notification permission not granted');
      return null;
    }
    
    // Get Expo push token
    const { data: token } = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // Replace with your actual Expo project ID
    });
    
    // Set up notification channels for Android
    if (Platform.OS === 'android') {
      await setupNotificationChannels();
    }
    
    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
};

/**
 * Set up notification channels for Android
 * @returns {Promise<void>}
 */
export const setupNotificationChannels = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
    
    await Notifications.setNotificationChannelAsync('appointments', {
      name: 'Appointment Reminders',
      description: 'Reminders for upcoming donation appointments',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
    
    await Notifications.setNotificationChannelAsync('requests', {
      name: 'Blood Requests',
      description: 'Notifications for blood requests',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
    
    await Notifications.setNotificationChannelAsync('general', {
      name: 'General',
      description: 'General notifications',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
};

/**
 * Schedule a local notification
 * @param {Object} notification - Notification object
 * @param {string} notification.title - Notification title
 * @param {string} notification.body - Notification body
 * @param {Object} notification.data - Notification data
 * @param {Date} notification.date - Date to schedule notification
 * @param {string} notification.channelId - Android channel ID
 * @returns {Promise<string>} - Notification ID
 */
export const scheduleLocalNotification = async ({ title, body, data = {}, date, channelId = 'default' }) => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        ...(Platform.OS === 'android' && { channelId }),
      },
      trigger: date instanceof Date ? { date } : null,
    });
    
    return notificationId;
  } catch (error) {
    console.error('Error scheduling local notification:', error);
    throw error;
  }
};

/**
 * Send an immediate local notification
 * @param {Object} notification - Notification object
 * @param {string} notification.title - Notification title
 * @param {string} notification.body - Notification body
 * @param {Object} notification.data - Notification data
 * @param {string} notification.channelId - Android channel ID
 * @returns {Promise<string>} - Notification ID
 */
export const sendLocalNotification = async ({ title, body, data = {}, channelId = 'default' }) => {
  return scheduleLocalNotification({ title, body, data, channelId });
};

/**
 * Schedule an appointment reminder notification
 * @param {Object} appointment - Appointment object
 * @param {Date} appointment.date - Appointment date
 * @param {string} appointment.location - Appointment location
 * @param {number} minutesBefore - Minutes before appointment to send reminder
 * @returns {Promise<string>} - Notification ID
 */
export const scheduleAppointmentReminder = async (appointment, minutesBefore = 60) => {
  const reminderDate = new Date(appointment.date);
  reminderDate.setMinutes(reminderDate.getMinutes() - minutesBefore);
  
  return scheduleLocalNotification({
    title: 'Donation Appointment Reminder',
    body: `Your blood donation appointment is in ${minutesBefore} minutes at ${appointment.location}`,
    data: {
      type: NOTIFICATION_TYPES.APPOINTMENT_REMINDER,
      appointmentId: appointment.id,
    },
    date: reminderDate,
    channelId: 'appointments',
  });
};

/**
 * Send a blood request notification
 * @param {Object} request - Blood request object
 * @returns {Promise<string>} - Notification ID
 */
export const sendBloodRequestNotification = async (request) => {
  return sendLocalNotification({
    title: 'Urgent Blood Request',
    body: `Blood type ${request.bloodType} needed at ${request.location}`,
    data: {
      type: NOTIFICATION_TYPES.NEW_REQUEST,
      requestId: request.id,
    },
    channelId: 'requests',
  });
};

/**
 * Cancel a scheduled notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<void>}
 */
export const cancelNotification = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
    throw error;
  }
};

/**
 * Cancel all scheduled notifications
 * @returns {Promise<void>}
 */
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
    throw error;
  }
};

/**
 * Get all scheduled notifications
 * @returns {Promise<Notifications.NotificationRequest[]>} - Array of scheduled notifications
 */
export const getAllScheduledNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

/**
 * Add a notification response listener
 * @param {Function} handler - Handler function for notification responses
 * @returns {Function} - Function to remove the listener
 */
export const addNotificationResponseListener = (handler) => {
  return Notifications.addNotificationResponseReceivedListener(handler);
};

/**
 * Add a notification received listener
 * @param {Function} handler - Handler function for received notifications
 * @returns {Function} - Function to remove the listener
 */
export const addNotificationReceivedListener = (handler) => {
  return Notifications.addNotificationReceivedListener(handler);
};

/**
 * Get the last notification response
 * @returns {Promise<Notifications.NotificationResponse|null>} - Last notification response
 */
export const getLastNotificationResponse = async () => {
  try {
    return await Notifications.getLastNotificationResponseAsync();
  } catch (error) {
    console.error('Error getting last notification response:', error);
    return null;
  }
};

/**
 * Set notification badge count
 * @param {number} count - Badge count
 * @returns {Promise<void>}
 */
export const setBadgeCount = async (count) => {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Error setting badge count:', error);
    throw error;
  }
};

/**
 * Get notification badge count
 * @returns {Promise<number>} - Badge count
 */
export const getBadgeCount = async () => {
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (error) {
    console.error('Error getting badge count:', error);
    return 0;
  }
};

/**
 * Dismiss all notifications
 * @returns {Promise<void>}
 */
export const dismissAllNotifications = async () => {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch (error) {
    console.error('Error dismissing all notifications:', error);
    throw error;
  }
};