// Firebase Cloud Functions - Blood Request Handling
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Create a new blood request
exports.createBloodRequest = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to create a blood request'
    );
  }

  try {
    const { bloodType, urgency, location, hospitalName, patientName, contactPhone, notes } = data;
    const userId = context.auth.uid;

    // Get user data
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User profile not found'
      );
    }

    // Create the request
    const requestRef = await db.collection('requests').add({
      userId,
      bloodType,
      urgency,
      location,
      hospitalName,
      patientName,
      contactPhone,
      notes,
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      donorId: null,
      fulfilledAt: null,
    });

    return {
      success: true,
      requestId: requestRef.id,
    };
  } catch (error) {
    console.error('Error creating blood request:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Update a blood request status
exports.updateRequestStatus = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to update a request'
    );
  }

  try {
    const { requestId, status, donorId } = data;
    const userId = context.auth.uid;

    // Get the request
    const requestDoc = await db.collection('requests').doc(requestId).get();
    if (!requestDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Request not found'
      );
    }

    const requestData = requestDoc.data();

    // Check permissions
    const isOwner = requestData.userId === userId;
    const isDonor = donorId === userId;
    const userDoc = await db.collection('users').doc(userId).get();
    const isAdmin = userDoc.exists && userDoc.data().role === 'admin';

    if (!isOwner && !isDonor && !isAdmin) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'You do not have permission to update this request'
      );
    }

    // Update the request
    const updateData = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (status === 'fulfilled' && donorId) {
      updateData.donorId = donorId;
      updateData.fulfilledAt = admin.firestore.FieldValue.serverTimestamp();
    }

    await db.collection('requests').doc(requestId).update(updateData);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error updating request status:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});