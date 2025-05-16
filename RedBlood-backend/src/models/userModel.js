/**
 * User model definition
 * 
 * Since we're using Firebase, this is not a traditional database model,
 * but rather a schema definition and helper functions for Firebase Firestore.
 */

const { firestore } = require('../config/firebase');

// Collection reference
const usersCollection = firestore.collection('users');

/**
 * User schema definition
 * This is used for validation and documentation purposes
 */
const userSchema = {
  uid: String,           // Firebase Auth UID
  email: String,         // User email
  fullName: String,      // User full name
  bloodType: String,     // Blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)
  phoneNumber: String,   // User phone number
  dateOfBirth: Date,     // User date of birth
  address: {             // User address
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  location: {            // User location coordinates
    latitude: Number,
    longitude: Number,
  },
  notificationPreferences: {  // User notification preferences
    email: Boolean,
    push: Boolean,
    sms: Boolean,
  },
  role: String,          // User role (donor, recipient, admin)
  lastDonation: Date,    // Date of last donation
  eligibleToDonateSince: Date, // Date when user becomes eligible to donate again
  medicalInfo: {         // Medical information
    weight: Number,      // Weight in kg
    height: Number,      // Height in cm
    allergies: [String], // List of allergies
    medications: [String], // List of medications
    conditions: [String], // List of medical conditions
  },
  donationHistory: [{    // History of donations
    id: String,          // Donation ID
    date: Date,          // Donation date
    donationType: String, // Type of donation
    location: String,    // Donation location
    units: Number,       // Units donated
  }],
  requestHistory: [{     // History of blood requests
    id: String,          // Request ID
    date: Date,          // Request date
    bloodType: String,   // Blood type requested
    units: Number,       // Units requested
    status: String,      // Request status
  }],
  createdAt: Date,       // Account creation date
  updatedAt: Date,       // Last update date
  active: Boolean,       // Whether the account is active
};

/**
 * Create a new user document in Firestore
 * @param {string} uid - Firebase Auth UID
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Created user document
 */
const createUser = async (uid, userData) => {
  const now = new Date();
  
  const newUser = {
    uid,
    ...userData,
    notificationPreferences: userData.notificationPreferences || {
      email: true,
      push: true,
      sms: false,
    },
    role: userData.role || 'donor',
    createdAt: now,
    updatedAt: now,
    active: true,
  };
  
  await usersCollection.doc(uid).set(newUser);
  return newUser;
};

/**
 * Get a user by UID
 * @param {string} uid - Firebase Auth UID
 * @returns {Promise<Object|null>} - User document or null if not found
 */
const getUserById = async (uid) => {
  const userDoc = await usersCollection.doc(uid).get();
  
  if (!userDoc.exists) {
    return null;
  }
  
  return { id: userDoc.id, ...userDoc.data() };
};

/**
 * Get a user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} - User document or null if not found
 */
const getUserByEmail = async (email) => {
  const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
  
  if (snapshot.empty) {
    return null;
  }
  
  const userDoc = snapshot.docs[0];
  return { id: userDoc.id, ...userDoc.data() };
};

/**
 * Update a user document
 * @param {string} uid - Firebase Auth UID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated user document
 */
const updateUser = async (uid, updateData) => {
  const userRef = usersCollection.doc(uid);
  
  // Add updatedAt timestamp
  updateData.updatedAt = new Date();
  
  await userRef.update(updateData);
  
  // Get the updated document
  const updatedDoc = await userRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

/**
 * Delete a user document
 * @param {string} uid - Firebase Auth UID
 * @returns {Promise<void>}
 */
const deleteUser = async (uid) => {
  await usersCollection.doc(uid).delete();
};

/**
 * Get all users with optional filtering
 * @param {Object} filters - Filter criteria
 * @param {number} limit - Maximum number of users to return
 * @param {string} startAfter - Document ID to start after (for pagination)
 * @returns {Promise<Array>} - Array of user documents
 */
const getUsers = async (filters = {}, limit = 10, startAfter = null) => {
  let query = usersCollection;
  
  // Apply filters
  if (filters.bloodType) {
    query = query.where('bloodType', '==', filters.bloodType);
  }
  
  if (filters.role) {
    query = query.where('role', '==', filters.role);
  }
  
  if (filters.active !== undefined) {
    query = query.where('active', '==', filters.active);
  }
  
  // Apply sorting
  query = query.orderBy('createdAt', 'desc');
  
  // Apply pagination
  if (startAfter) {
    const startDoc = await usersCollection.doc(startAfter).get();
    if (startDoc.exists) {
      query = query.startAfter(startDoc);
    }
  }
  
  // Apply limit
  query = query.limit(limit);
  
  // Execute query
  const snapshot = await query.get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

module.exports = {
  usersCollection,
  userSchema,
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  getUsers,
};