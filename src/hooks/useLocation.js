/**
 * Custom hook for accessing location services
 */

import { useState, useEffect, useCallback } from 'react';
import * as locationService from '../services/locationService';

/**
 * Hook to access location services
 * @param {Object} options - Hook options
 * @param {boolean} options.watchPosition - Whether to watch position changes
 * @param {number} options.watchInterval - Interval for position updates in ms
 * @param {boolean} options.getInitialPosition - Whether to get initial position
 * @returns {Object} Location data and functions
 */
const useLocation = ({
  watchPosition = false,
  watchInterval = 5000,
  getInitialPosition = true,
} = {}) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [watchSubscription, setWatchSubscription] = useState(null);

  /**
   * Get current location
   * @returns {Promise<Object>} Location object
   */
  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      
      const currentLocation = await locationService.getCurrentLocation();
      setLocation(currentLocation);
      return currentLocation;
    } catch (error) {
      setErrorMsg(error.message || 'Error getting location');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Start watching location
   * @returns {Promise<void>}
   */
  const startWatchingLocation = useCallback(async () => {
    try {
      // Stop any existing watch
      if (watchSubscription) {
        watchSubscription();
        setWatchSubscription(null);
      }
      
      // Start new watch
      const unsubscribe = await locationService.watchLocation((newLocation) => {
        setLocation(newLocation);
      });
      
      setWatchSubscription(() => unsubscribe);
    } catch (error) {
      setErrorMsg(error.message || 'Error watching location');
    }
  }, [watchSubscription]);

  /**
   * Stop watching location
   */
  const stopWatchingLocation = useCallback(() => {
    if (watchSubscription) {
      watchSubscription();
      setWatchSubscription(null);
    }
  }, [watchSubscription]);

  /**
   * Get address from coordinates
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {Promise<Object>} Address object
   */
  const getAddressFromCoordinates = useCallback(async (latitude, longitude) => {
    try {
      return await locationService.reverseGeocodeLocation(latitude, longitude);
    } catch (error) {
      setErrorMsg(error.message || 'Error getting address');
      return null;
    }
  }, []);

  /**
   * Get coordinates from address
   * @param {string} address - Address string
   * @returns {Promise<Object>} Location object with coordinates
   */
  const getCoordinatesFromAddress = useCallback(async (address) => {
    try {
      return await locationService.geocodeAddress(address);
    } catch (error) {
      setErrorMsg(error.message || 'Error getting coordinates');
      return null;
    }
  }, []);

  /**
   * Calculate distance between two points
   * @param {number} lat1 - Latitude of first point
   * @param {number} lon1 - Longitude of first point
   * @param {number} lat2 - Latitude of second point
   * @param {number} lon2 - Longitude of second point
   * @returns {number} Distance in kilometers
   */
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    return locationService.calculateDistance(lat1, lon1, lat2, lon2);
  }, []);

  /**
   * Get nearby locations
   * @param {Array} locations - Array of location objects
   * @param {number} radius - Radius in kilometers
   * @returns {Array} Filtered and sorted locations with distance
   */
  const getNearbyLocations = useCallback((locations, radius) => {
    if (!location) return [];
    return locationService.getNearbyLocations(locations, location, radius);
  }, [location]);

  // Get initial position on mount
  useEffect(() => {
    if (getInitialPosition) {
      getCurrentLocation();
    }
  }, [getInitialPosition, getCurrentLocation]);

  // Set up position watching
  useEffect(() => {
    if (watchPosition) {
      startWatchingLocation();
    } else if (watchSubscription) {
      stopWatchingLocation();
    }

    // Cleanup on unmount
    return () => {
      if (watchSubscription) {
        watchSubscription();
      }
    };
  }, [watchPosition, startWatchingLocation, stopWatchingLocation, watchSubscription]);

  return {
    location,
    loading,
    error: errorMsg,
    getCurrentLocation,
    startWatchingLocation,
    stopWatchingLocation,
    getAddressFromCoordinates,
    getCoordinatesFromAddress,
    calculateDistance,
    getNearbyLocations,
    isWatching: !!watchSubscription,
  };
};

export default useLocation;