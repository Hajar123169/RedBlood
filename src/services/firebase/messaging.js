// Firebase Cloud Messaging Service
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import app from './config';
import db from './database';
import { doc, updateDoc } from 'firebase/firestore';

// Initialize Firebase Messaging
let messaging;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.error('Error initializing Firebase Messaging:', error);
}

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register for push notifications
 * @returns {Promise<string>} - FCM token
 */
export const registerForPushNotifications = async () => {
  try {
    // Check if physical device
    if (!Device.isDevice) {
      console.log('Push notifications are not supported in the simulator');
      return null;
    }

    // Check permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    // Get Expo push token
    const expoPushToken = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });

    // On Android, set notification channel
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Get FCM token if messaging is available
    let fcmToken = null;
    if (messaging) {
      fcmToken = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY_HERE',
      });
    }

    // Store tokens
    await AsyncStorage.setItem('expoPushToken', expoPushToken.data);
    if (fcmToken) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }

    return fcmToken || expoPushToken.data;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
};

/**
 * Save FCM token to user profile in Firestore
 * @param {string} userId - User ID
 * @param {string} token - FCM token
 */
export const saveFCMToken = async (userId, token) => {
  if (!userId || !token) return;
  
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      fcmToken: token,
      tokenUpdatedAt: new Date()
    });
    console.log('FCM token saved to user profile');
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};

/**
 * Listen for foreground messages
 * @param {Function} callback - Function to call when a message is received
 * @returns {Function} - Unsubscribe function
 */
export const onForegroundMessage = (callback) => {
  if (!messaging) {
    console.log('Firebase Messaging not available');
    return () => {};
  }
  
  return onMessage(messaging, (message) => {
    console.log('Foreground message received:', message);
    callback(message);
  });
};

/**
 * Set up notification listeners
 * @param {Object} handlers - Object containing notification handlers
 * @returns {Function} - Cleanup function to remove listeners
 */
export const setupNotificationListeners = (handlers = {}) => {
  const { 
    onNotificationReceived, 
    onNotificationResponse, 
    onForegroundNotification 
  } = handlers;
  
  // Handle received notifications
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    notification => {
      console.log('Notification received:', notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    }
  );

  // Handle notification responses (when user taps notification)
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    response => {
      console.log('Notification response received:', response);
      if (onNotificationResponse) {
        onNotificationResponse(response);
      }
    }
  );

  // Handle foreground messages from Firebase
  let foregroundUnsubscribe = () => {};
  if (onForegroundNotification) {
    foregroundUnsubscribe = onForegroundMessage(onForegroundNotification);
  }

  // Return cleanup function
  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
    foregroundUnsubscribe();
  };
};

/**
 * Send a local notification
 * @param {Object} notification - Notification content
 * @returns {Promise<string>} - Notification ID
 */
export const sendLocalNotification = async (notification) => {
  const { title, body, data } = notification;
  
  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
    },
    trigger: null, // Immediately
  });
};

export default {
  registerForPushNotifications,
  saveFCMToken,
  onForegroundMessage,
  setupNotificationListeners,
  sendLocalNotification,
};