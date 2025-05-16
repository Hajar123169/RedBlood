/**
 * Storage service for the RedBlood app
 * Provides a unified interface for local storage operations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save data to storage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified if not a string)
 * @returns {Promise<void>}
 */
export const saveData = async (key, value) => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
    throw error;
  }
};

/**
 * Get data from storage
 * @param {string} key - Storage key
 * @param {boolean} parseJson - Whether to parse the result as JSON
 * @returns {Promise<any>} - Retrieved value
 */
export const getData = async (key, parseJson = true) => {
  try {
    const value = await AsyncStorage.getItem(key);
    
    if (value === null) {
      return null;
    }
    
    return parseJson ? JSON.parse(value) : value;
  } catch (error) {
    console.error(`Error getting data for key ${key}:`, error);
    
    // If JSON parsing fails, return the raw value
    if (parseJson && error instanceof SyntaxError) {
      const rawValue = await AsyncStorage.getItem(key);
      return rawValue;
    }
    
    return null;
  }
};

/**
 * Remove data from storage
 * @param {string} key - Storage key
 * @returns {Promise<void>}
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    throw error;
  }
};

/**
 * Clear all app data from storage
 * @returns {Promise<void>}
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};

/**
 * Get all keys from storage
 * @returns {Promise<string[]>} - Array of keys
 */
export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};

/**
 * Get multiple items from storage
 * @param {string[]} keys - Array of keys to retrieve
 * @param {boolean} parseJson - Whether to parse the results as JSON
 * @returns {Promise<Object>} - Object with key-value pairs
 */
export const multiGet = async (keys, parseJson = true) => {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    
    return pairs.reduce((result, [key, value]) => {
      result[key] = parseJson && value ? JSON.parse(value) : value;
      return result;
    }, {});
  } catch (error) {
    console.error('Error getting multiple items:', error);
    
    // If JSON parsing fails, return raw values
    if (parseJson && error instanceof SyntaxError) {
      const pairs = await AsyncStorage.multiGet(keys);
      return pairs.reduce((result, [key, value]) => {
        result[key] = value;
        return result;
      }, {});
    }
    
    return {};
  }
};

/**
 * Save multiple items to storage
 * @param {Object} keyValuePairs - Object with key-value pairs
 * @returns {Promise<void>}
 */
export const multiSave = async (keyValuePairs) => {
  try {
    const pairs = Object.entries(keyValuePairs).map(([key, value]) => {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      return [key, stringValue];
    });
    
    await AsyncStorage.multiSet(pairs);
  } catch (error) {
    console.error('Error saving multiple items:', error);
    throw error;
  }
};

/**
 * Remove multiple items from storage
 * @param {string[]} keys - Array of keys to remove
 * @returns {Promise<void>}
 */
export const multiRemove = async (keys) => {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Error removing multiple items:', error);
    throw error;
  }
};

/**
 * Check if a key exists in storage
 * @param {string} key - Storage key
 * @returns {Promise<boolean>} - Whether the key exists
 */
export const hasKey = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  } catch (error) {
    console.error(`Error checking if key ${key} exists:`, error);
    return false;
  }
};

/**
 * Get the size of stored data for a key (approximate)
 * @param {string} key - Storage key
 * @returns {Promise<number>} - Size in bytes
 */
export const getDataSize = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    
    if (value === null) {
      return 0;
    }
    
    // Calculate size in bytes (2 bytes per character in UTF-16)
    return value.length * 2;
  } catch (error) {
    console.error(`Error getting data size for key ${key}:`, error);
    return 0;
  }
};