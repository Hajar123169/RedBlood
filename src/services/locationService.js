/**
 * Location service for the RedBlood app
 * Handles location-related functionality
 */

import * as Location from 'expo-location';
import { requestLocationPermission, requestBackgroundLocationPermission } from '../utils/permissions';

/**
 * Get the current location of the user
 * @returns {Promise<Object>} - Location object with latitude and longitude
 */
export const getCurrentLocation = async () => {
  try {
    // Request permission
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      throw new Error('Location permission not granted');
    }
    
    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: location.timestamp,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    throw error;
  }
};

/**
 * Get location updates
 * @param {Function} callback - Function to call with location updates
 * @returns {Promise<Function>} - Function to remove the location subscription
 */
export const watchLocation = async (callback) => {
  try {
    // Request permission
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      throw new Error('Location permission not granted');
    }
    
    // Start watching position
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Update if moved by 10 meters
      },
      (location) => {
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          timestamp: location.timestamp,
        });
      }
    );
    
    // Return function to remove subscription
    return () => subscription.remove();
  } catch (error) {
    console.error('Error watching location:', error);
    throw error;
  }
};

/**
 * Request background location tracking
 * @returns {Promise<boolean>} - Whether permission was granted
 */
export const enableBackgroundLocation = async () => {
  return await requestBackgroundLocationPermission();
};

/**
 * Start background location updates
 * @returns {Promise<Object>} - Location task info
 */
export const startBackgroundLocationUpdates = async () => {
  try {
    // Request background permission
    const hasPermission = await enableBackgroundLocation();
    
    if (!hasPermission) {
      throw new Error('Background location permission not granted');
    }
    
    // Define the task
    const taskName = 'background-location-task';
    
    // Check if task is already defined
    const isTaskDefined = await Location.hasStartedLocationUpdatesAsync(taskName);
    
    if (isTaskDefined) {
      // Stop existing task before starting a new one
      await Location.stopLocationUpdatesAsync(taskName);
    }
    
    // Start the task
    await Location.startLocationUpdatesAsync(taskName, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 60000, // Update every minute
      distanceInterval: 50, // Update if moved by 50 meters
      foregroundService: {
        notificationTitle: 'RedBlood is tracking your location',
        notificationBody: 'This is used to find nearby donation centers and blood requests',
      },
      activityType: Location.ActivityType.Other,
      showsBackgroundLocationIndicator: true,
    });
    
    return { taskName };
  } catch (error) {
    console.error('Error starting background location updates:', error);
    throw error;
  }
};

/**
 * Stop background location updates
 * @param {string} taskName - Name of the location task
 * @returns {Promise<void>}
 */
export const stopBackgroundLocationUpdates = async (taskName = 'background-location-task') => {
  try {
    const isTaskDefined = await Location.hasStartedLocationUpdatesAsync(taskName);
    
    if (isTaskDefined) {
      await Location.stopLocationUpdatesAsync(taskName);
    }
  } catch (error) {
    console.error('Error stopping background location updates:', error);
    throw error;
  }
};

/**
 * Geocode an address to coordinates
 * @param {string} address - Address to geocode
 * @returns {Promise<Object>} - Location object with latitude and longitude
 */
export const geocodeAddress = async (address) => {
  try {
    const results = await Location.geocodeAsync(address);
    
    if (results.length === 0) {
      throw new Error('No location found for the address');
    }
    
    return {
      latitude: results[0].latitude,
      longitude: results[0].longitude,
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
};

/**
 * Reverse geocode coordinates to address
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<Object>} - Address object
 */
export const reverseGeocodeLocation = async (latitude, longitude) => {
  try {
    const results = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    
    if (results.length === 0) {
      throw new Error('No address found for the coordinates');
    }
    
    return results[0];
  } catch (error) {
    console.error('Error reverse geocoding location:', error);
    throw error;
  }
};

/**
 * Calculate distance between two coordinates in kilometers
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Haversine formula to calculate distance between two points
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
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
 * Get nearby locations based on current location and radius
 * @param {Array} locations - Array of location objects with latitude and longitude
 * @param {Object} currentLocation - Current location object with latitude and longitude
 * @param {number} radius - Radius in kilometers
 * @returns {Array} - Array of nearby locations with distance added
 */
export const getNearbyLocations = (locations, currentLocation, radius) => {
  if (!currentLocation || !locations || !Array.isArray(locations)) {
    return [];
  }
  
  return locations
    .map(location => {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        location.latitude,
        location.longitude
      );
      
      return {
        ...location,
        distance,
      };
    })
    .filter(location => location.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
};