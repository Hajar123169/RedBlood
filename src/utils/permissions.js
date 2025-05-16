/**
 * Permission handling utilities for the RedBlood app
 */

import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import { Platform, Alert, Linking } from 'react-native';

/**
 * Request location permission
 * @returns {Promise<boolean>} - Whether permission was granted
 */
export const requestLocationPermission = async () => {
  try {
    const { status: existingStatus } = await Location.getForegroundPermissionsAsync();

    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Request background location permission (for tracking donations/requests)
 * @returns {Promise<boolean>} - Whether permission was granted
 */
export const requestBackgroundLocationPermission = async () => {
  try {
    // First ensure foreground permission is granted
    const hasForegroundPermission = await requestLocationPermission();

    if (!hasForegroundPermission) {
      return false;
    }

    if (Platform.OS === 'android') {
      const { status: existingStatus } = await Location.getBackgroundPermissionsAsync();

      if (existingStatus === 'granted') {
        return true;
      }

      const { status } = await Location.requestBackgroundPermissionsAsync();
      return status === 'granted';
    }

    // iOS doesn't have separate background permission
    return true;
  } catch (error) {
    console.error('Error requesting background location permission:', error);
    return false;
  }
};

/**
 * Request notification permission
 * @returns {Promise<boolean>} - Whether permission was granted
 */
export const requestNotificationPermission = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Request camera permission
 * @returns {Promise<boolean>} - Whether permission was granted
 */
export const requestCameraPermission = async () => {
  try {
    const { status: existingStatus } = await Camera.getCameraPermissionsAsync();

    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

/**
 * Request media library permission
 * @returns {Promise<boolean>} - Whether permission was granted
 */
export const requestMediaLibraryPermission = async () => {
  try {
    const { status: existingStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting media library permission:', error);
    return false;
  }
};

/**
 * Show permission explanation alert
 * @param {string} permissionType - Type of permission
 * @param {string} reason - Reason for needing the permission
 * @returns {Promise<void>}
 */
export const showPermissionExplanation = async (permissionType, reason) => {
  return new Promise((resolve) => {
    Alert.alert(
      `${permissionType} Permission Required`,
      `RedBlood needs ${permissionType.toLowerCase()} permission ${reason}. Please grant this permission in your device settings.`,
      [
        {
          text: 'Cancel',
          onPress: () => resolve(false),
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => {
            // Open app settings
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
            resolve(true);
          },
        },
      ]
    );
  });
};

/**
 * Check and request all required permissions
 * @returns {Promise<Object>} - Object with permission statuses
 */
export const checkAndRequestAllPermissions = async () => {
  const locationPermission = await requestLocationPermission();
  const notificationPermission = await requestNotificationPermission();

  return {
    location: locationPermission,
    notifications: notificationPermission,
  };
};
