// Firebase Storage Service
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from "firebase/storage";
import app from './config';

// Initialize Firebase Storage
const storage = getStorage(app);

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - The path in storage where the file should be saved
 * @param {Object} metadata - Optional metadata for the file
 * @returns {Promise<string>} - The download URL of the uploaded file
 */
export const uploadFile = async (file, path, metadata = {}) => {
  try {
    // Create a storage reference
    const storageRef = ref(storage, path);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file, metadata);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload a profile image
 * @param {File} file - The image file to upload
 * @param {string} userId - The user ID
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
export const uploadProfileImage = async (file, userId) => {
  const path = `users/${userId}/profile.${file.name.split('.').pop()}`;
  const metadata = {
    contentType: file.type,
    customMetadata: {
      'purpose': 'profile',
      'userId': userId
    }
  };
  
  return uploadFile(file, path, metadata);
};

/**
 * Upload a donation certificate or document
 * @param {File} file - The document file to upload
 * @param {string} userId - The user ID
 * @param {string} donationId - The donation ID
 * @returns {Promise<string>} - The download URL of the uploaded document
 */
export const uploadDonationDocument = async (file, userId, donationId) => {
  const path = `donations/${userId}/${donationId}/${file.name}`;
  const metadata = {
    contentType: file.type,
    customMetadata: {
      'purpose': 'donation-document',
      'userId': userId,
      'donationId': donationId
    }
  };
  
  return uploadFile(file, path, metadata);
};

/**
 * Get the download URL for a file
 * @param {string} path - The path to the file in storage
 * @returns {Promise<string>} - The download URL
 */
export const getFileUrl = async (path) => {
  try {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

/**
 * Delete a file from storage
 * @param {string} path - The path to the file in storage
 * @returns {Promise<void>}
 */
export const deleteFile = async (path) => {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * List all files in a directory
 * @param {string} path - The path to the directory in storage
 * @returns {Promise<Array>} - Array of file references
 */
export const listFiles = async (path) => {
  try {
    const directoryRef = ref(storage, path);
    const result = await listAll(directoryRef);
    
    // Get download URLs for all items
    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          url
        };
      })
    );
    
    return files;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

export default storage;