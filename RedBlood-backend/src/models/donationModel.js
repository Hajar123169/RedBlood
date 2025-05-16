/**
 * Donation model definition
 * 
 * Since we're using Firebase, this is not a traditional database model,
 * but rather a schema definition and helper functions for Firebase Firestore.
 */

const { firestore } = require('../config/firebase');

// Collection reference
const donationsCollection = firestore.collection('donations');
const donationCentersCollection = firestore.collection('donationCenters');

/**
 * Donation schema definition
 * This is used for validation and documentation purposes
 */
const donationSchema = {
  id: String,                // Donation ID (Firestore document ID)
  userId: String,            // User ID of the donor
  donationCenterId: String,  // ID of the donation center
  appointmentDate: Date,     // Scheduled appointment date
  donationType: String,      // Type of donation (whole_blood, plasma, platelets, double_red_cells)
  status: String,            // Status (scheduled, completed, cancelled, no_show, deferred)
  units: Number,             // Units donated (typically 1 for whole blood)
  hemoglobinLevel: Number,   // Hemoglobin level before donation
  notes: String,             // Additional notes
  completedAt: Date,         // When the donation was completed
  createdAt: Date,           // When the donation record was created
  updatedAt: Date,           // When the donation record was last updated
};

/**
 * Donation center schema definition
 */
const donationCenterSchema = {
  id: String,                // Center ID (Firestore document ID)
  name: String,              // Center name
  address: {                 // Center address
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  location: {                // Center location coordinates
    latitude: Number,
    longitude: Number,
  },
  contactInfo: {             // Contact information
    phone: String,
    email: String,
    website: String,
  },
  operatingHours: [{         // Operating hours
    day: String,             // Day of week
    open: String,            // Opening time (HH:MM)
    close: String,           // Closing time (HH:MM)
    isClosed: Boolean,       // Whether center is closed on this day
  }],
  services: [String],        // Available services (whole_blood, plasma, etc.)
  walkInAllowed: Boolean,    // Whether walk-ins are allowed
  appointmentRequired: Boolean, // Whether appointments are required
  active: Boolean,           // Whether the center is active
  createdAt: Date,           // When the center record was created
  updatedAt: Date,           // When the center record was last updated
};

/**
 * Create a new donation record
 * @param {Object} donationData - Donation data
 * @returns {Promise<Object>} - Created donation document
 */
const createDonation = async (donationData) => {
  const now = new Date();
  
  const newDonation = {
    ...donationData,
    status: donationData.status || 'scheduled',
    units: donationData.units || 1,
    createdAt: now,
    updatedAt: now,
  };
  
  const docRef = await donationsCollection.add(newDonation);
  return { id: docRef.id, ...newDonation };
};

/**
 * Get a donation by ID
 * @param {string} id - Donation ID
 * @returns {Promise<Object|null>} - Donation document or null if not found
 */
const getDonationById = async (id) => {
  const donationDoc = await donationsCollection.doc(id).get();
  
  if (!donationDoc.exists) {
    return null;
  }
  
  return { id: donationDoc.id, ...donationDoc.data() };
};

/**
 * Update a donation record
 * @param {string} id - Donation ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated donation document
 */
const updateDonation = async (id, updateData) => {
  const donationRef = donationsCollection.doc(id);
  
  // Add updatedAt timestamp
  updateData.updatedAt = new Date();
  
  // If status is being updated to 'completed', add completedAt timestamp
  if (updateData.status === 'completed' && !updateData.completedAt) {
    updateData.completedAt = new Date();
  }
  
  await donationRef.update(updateData);
  
  // Get the updated document
  const updatedDoc = await donationRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

/**
 * Delete a donation record
 * @param {string} id - Donation ID
 * @returns {Promise<void>}
 */
const deleteDonation = async (id) => {
  await donationsCollection.doc(id).delete();
};

/**
 * Get all donations for a user
 * @param {string} userId - User ID
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} - Array of donation documents
 */
const getUserDonations = async (userId, filters = {}) => {
  let query = donationsCollection.where('userId', '==', userId);
  
  // Apply filters
  if (filters.status) {
    query = query.where('status', '==', filters.status);
  }
  
  if (filters.donationType) {
    query = query.where('donationType', '==', filters.donationType);
  }
  
  // Apply date range filter if provided
  if (filters.startDate && filters.endDate) {
    query = query.where('appointmentDate', '>=', new Date(filters.startDate))
                .where('appointmentDate', '<=', new Date(filters.endDate));
  }
  
  // Apply sorting
  query = query.orderBy('appointmentDate', filters.order || 'desc');
  
  // Execute query
  const snapshot = await query.get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Create a new donation center
 * @param {Object} centerData - Donation center data
 * @returns {Promise<Object>} - Created donation center document
 */
const createDonationCenter = async (centerData) => {
  const now = new Date();
  
  const newCenter = {
    ...centerData,
    active: centerData.active !== undefined ? centerData.active : true,
    createdAt: now,
    updatedAt: now,
  };
  
  const docRef = await donationCentersCollection.add(newCenter);
  return { id: docRef.id, ...newCenter };
};

/**
 * Get a donation center by ID
 * @param {string} id - Donation center ID
 * @returns {Promise<Object|null>} - Donation center document or null if not found
 */
const getDonationCenterById = async (id) => {
  const centerDoc = await donationCentersCollection.doc(id).get();
  
  if (!centerDoc.exists) {
    return null;
  }
  
  return { id: centerDoc.id, ...centerDoc.data() };
};

/**
 * Update a donation center
 * @param {string} id - Donation center ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated donation center document
 */
const updateDonationCenter = async (id, updateData) => {
  const centerRef = donationCentersCollection.doc(id);
  
  // Add updatedAt timestamp
  updateData.updatedAt = new Date();
  
  await centerRef.update(updateData);
  
  // Get the updated document
  const updatedDoc = await centerRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

/**
 * Get all donation centers with optional filtering
 * @param {Object} filters - Filter criteria
 * @param {Object} location - User location for distance calculation
 * @param {number} radius - Search radius in kilometers
 * @returns {Promise<Array>} - Array of donation center documents
 */
const getDonationCenters = async (filters = {}, location = null, radius = null) => {
  let query = donationCentersCollection;
  
  // Apply filters
  if (filters.services && filters.services.length > 0) {
    query = query.where('services', 'array-contains-any', filters.services);
  }
  
  if (filters.active !== undefined) {
    query = query.where('active', '==', filters.active);
  }
  
  // Execute query
  const snapshot = await query.get();
  
  let centers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Filter by location if provided
  if (location && radius) {
    centers = centers.filter(center => {
      if (!center.location) return false;
      
      // Calculate distance using Haversine formula
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        center.location.latitude,
        center.location.longitude
      );
      
      // Add distance to center object
      center.distance = distance;
      
      // Filter by radius
      return distance <= radius;
    });
    
    // Sort by distance
    centers.sort((a, b) => a.distance - b.distance);
  }
  
  return centers;
};

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} - Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
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

module.exports = {
  donationsCollection,
  donationCentersCollection,
  donationSchema,
  donationCenterSchema,
  createDonation,
  getDonationById,
  updateDonation,
  deleteDonation,
  getUserDonations,
  createDonationCenter,
  getDonationCenterById,
  updateDonationCenter,
  getDonationCenters,
};