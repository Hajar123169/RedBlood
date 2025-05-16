/**
 * Firebase configuration and initialization
 */

const admin = require('firebase-admin');
const env = require('./env');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      // Initialize with environment variables
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.firebase.projectId,
          privateKey: env.firebase.privateKey,
          clientEmail: env.firebase.clientEmail,
        }),
        // Optional: Database URL if using Realtime Database
        // databaseURL: env.firebase.databaseURL,
      });
      
      console.log('Firebase Admin SDK initialized successfully');
    }
    
    return admin;
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    throw error;
  }
};

// Initialize Firebase
const firebase = initializeFirebase();

// Export Firebase services
module.exports = {
  admin: firebase,
  auth: firebase.auth(),
  firestore: firebase.firestore(),
  storage: firebase.storage(),
  messaging: firebase.messaging(),
};