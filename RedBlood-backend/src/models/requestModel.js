/**
 * Blood Request model definition
 * 
 * Since we're using Firebase, this is not a traditional database model,
 * but rather a schema definition and helper functions for Firebase Firestore.
 */

const { firestore } = require('../config/firebase');
const { calculateDistance, deg2rad } = require('../utils/helpers');

// Collection reference
const requestsCollection = firestore.collection('bloodRequests');
const responsesCollection = firestore.collection('requestResponses');

/**
 * Blood request schema definition
 * This is used for validation and documentation purposes
 */
const requestSchema = {
  id: String,                // Request ID (Firestore document ID)
  userId: String,            // User ID of the requester
  patientName: String,       // Name of the patient
  bloodType: String,         // Blood type needed (A+, A-, B+, B-, AB+, AB-, O+, O-)
  units: Number,             // Number of units needed
  hospital: String,          // Hospital name
  urgency: String,           // Urgency level (low, medium, high, critical)
  requiredBy: Date,          // Date by which blood is needed
  status: String,            // Status (pending, active, fulfilled, cancelled, expired)
  contactName: String,       // Contact person name
  contactPhone: String,      // Contact phone number
  contactEmail: String,      // Contact email
  notes: String,             // Additional notes
  location: {                // Location coordinates
    latitude: Number,
    longitude: Number,
  },
  address: {                 // Address details
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  responses: [String],       // Array of response IDs
  fulfilledBy: String,       // User ID who fulfilled the request
  fulfilledAt: Date,         // When the request was fulfilled
  createdAt: Date,           // When the request was created
  updatedAt: Date,           // When the request was last updated
  expiresAt: Date,           // When the request expires
};

/**
 * Request response schema definition
 */
const responseSchema = {
  id: String,                // Response ID (Firestore document ID)
  requestId: String,         // Blood request ID
  userId: String,            // User ID of the responder
  status: String,            // Status (pending, accepted, rejected, cancelled)
  message: String,           // Optional message from responder
  contactInfo: {             // Contact information
    name: String,
    phone: String,
    email: String,
  },
  scheduledDate: Date,       // Scheduled donation date
  createdAt: Date,           // When the response was created
  updatedAt: Date,           // When the response was last updated
};

/**
 * Create a new blood request
 * @param {Object} requestData - Blood request data
 * @returns {Promise<Object>} - Created request document
 */
const createRequest = async (requestData) => {
  const now = new Date();
  
  // Calculate expiration date (default: 7 days from now or requiredBy date if sooner)
  const defaultExpiry = new Date(now);
  defaultExpiry.setDate(defaultExpiry.getDate() + 7);
  
  const requiredByDate = requestData.requiredBy ? new Date(requestData.requiredBy) : null;
  const expiresAt = requiredByDate && requiredByDate < defaultExpiry ? requiredByDate : defaultExpiry;
  
  const newRequest = {
    ...requestData,
    status: requestData.status || 'active',
    responses: [],
    createdAt: now,
    updatedAt: now,
    expiresAt,
  };
  
  const docRef = await requestsCollection.add(newRequest);
  return { id: docRef.id, ...newRequest };
};

/**
 * Get a blood request by ID
 * @param {string} id - Request ID
 * @returns {Promise<Object|null>} - Request document or null if not found
 */
const getRequestById = async (id) => {
  const requestDoc = await requestsCollection.doc(id).get();
  
  if (!requestDoc.exists) {
    return null;
  }
  
  return { id: requestDoc.id, ...requestDoc.data() };
};

/**
 * Update a blood request
 * @param {string} id - Request ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated request document
 */
const updateRequest = async (id, updateData) => {
  const requestRef = requestsCollection.doc(id);
  
  // Add updatedAt timestamp
  updateData.updatedAt = new Date();
  
  // If status is being updated to 'fulfilled', add fulfilledAt timestamp
  if (updateData.status === 'fulfilled' && !updateData.fulfilledAt) {
    updateData.fulfilledAt = new Date();
  }
  
  await requestRef.update(updateData);
  
  // Get the updated document
  const updatedDoc = await requestRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

/**
 * Delete a blood request
 * @param {string} id - Request ID
 * @returns {Promise<void>}
 */
const deleteRequest = async (id) => {
  // First delete all responses to this request
  const responsesSnapshot = await responsesCollection.where('requestId', '==', id).get();
  
  const batch = firestore.batch();
  
  responsesSnapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  // Delete the request itself
  batch.delete(requestsCollection.doc(id));
  
  // Commit the batch
  await batch.commit();
};

/**
 * Get all blood requests with optional filtering
 * @param {Object} filters - Filter criteria
 * @param {Object} location - User location for distance calculation
 * @param {number} radius - Search radius in kilometers
 * @param {number} limit - Maximum number of requests to return
 * @returns {Promise<Array>} - Array of request documents
 */
const getRequests = async (filters = {}, location = null, radius = null, limit = 20) => {
  let query = requestsCollection;
  
  // Apply filters
  if (filters.bloodType) {
    query = query.where('bloodType', '==', filters.bloodType);
  }
  
  if (filters.status) {
    query = query.where('status', '==', filters.status);
  } else {
    // By default, only show active requests
    query = query.where('status', '==', 'active');
  }
  
  if (filters.urgency) {
    query = query.where('urgency', '==', filters.urgency);
  }
  
  // Apply sorting
  if (filters.sortBy === 'urgency') {
    // Custom sorting for urgency will be handled in memory
    query = query.orderBy('createdAt', 'desc');
  } else {
    query = query.orderBy(filters.sortBy || 'createdAt', filters.order || 'desc');
  }
  
  // Apply limit
  query = query.limit(limit);
  
  // Execute query
  const snapshot = await query.get();
  
  let requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Filter by location if provided
  if (location && radius) {
    requests = requests.filter(request => {
      if (!request.location) return false;
      
      // Calculate distance
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        request.location.latitude,
        request.location.longitude
      );
      
      // Add distance to request object
      request.distance = distance;
      
      // Filter by radius
      return distance <= radius;
    });
    
    // Sort by distance if requested
    if (filters.sortBy === 'distance') {
      requests.sort((a, b) => a.distance - b.distance);
    }
  }
  
  // Custom sorting for urgency if requested
  if (filters.sortBy === 'urgency') {
    const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    requests.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
  }
  
  return requests;
};

/**
 * Get all blood requests for a user
 * @param {string} userId - User ID
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} - Array of request documents
 */
const getUserRequests = async (userId, filters = {}) => {
  let query = requestsCollection.where('userId', '==', userId);
  
  // Apply filters
  if (filters.status) {
    query = query.where('status', '==', filters.status);
  }
  
  if (filters.bloodType) {
    query = query.where('bloodType', '==', filters.bloodType);
  }
  
  // Apply sorting
  query = query.orderBy('createdAt', filters.order || 'desc');
  
  // Execute query
  const snapshot = await query.get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Create a response to a blood request
 * @param {Object} responseData - Response data
 * @returns {Promise<Object>} - Created response document
 */
const createResponse = async (responseData) => {
  const now = new Date();
  
  const newResponse = {
    ...responseData,
    status: responseData.status || 'pending',
    createdAt: now,
    updatedAt: now,
  };
  
  // Start a batch
  const batch = firestore.batch();
  
  // Add the response
  const responseRef = responsesCollection.doc();
  batch.set(responseRef, newResponse);
  
  // Update the request with the new response ID
  const requestRef = requestsCollection.doc(responseData.requestId);
  batch.update(requestRef, {
    responses: firestore.FieldValue.arrayUnion(responseRef.id),
    updatedAt: now,
  });
  
  // Commit the batch
  await batch.commit();
  
  return { id: responseRef.id, ...newResponse };
};

/**
 * Get a response by ID
 * @param {string} id - Response ID
 * @returns {Promise<Object|null>} - Response document or null if not found
 */
const getResponseById = async (id) => {
  const responseDoc = await responsesCollection.doc(id).get();
  
  if (!responseDoc.exists) {
    return null;
  }
  
  return { id: responseDoc.id, ...responseDoc.data() };
};

/**
 * Update a response
 * @param {string} id - Response ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated response document
 */
const updateResponse = async (id, updateData) => {
  const responseRef = responsesCollection.doc(id);
  
  // Add updatedAt timestamp
  updateData.updatedAt = new Date();
  
  await responseRef.update(updateData);
  
  // Get the updated document
  const updatedDoc = await responseRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

/**
 * Get all responses for a request
 * @param {string} requestId - Request ID
 * @returns {Promise<Array>} - Array of response documents
 */
const getRequestResponses = async (requestId) => {
  const snapshot = await responsesCollection.where('requestId', '==', requestId).get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Get all responses by a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of response documents
 */
const getUserResponses = async (userId) => {
  const snapshot = await responsesCollection.where('userId', '==', userId).get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

module.exports = {
  requestsCollection,
  responsesCollection,
  requestSchema,
  responseSchema,
  createRequest,
  getRequestById,
  updateRequest,
  deleteRequest,
  getRequests,
  getUserRequests,
  createResponse,
  getResponseById,
  updateResponse,
  getRequestResponses,
  getUserResponses,
};