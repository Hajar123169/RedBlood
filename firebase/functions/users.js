// Firebase Cloud Functions - User Management
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Create a new user in Firestore when a new Firebase Auth user is created
exports.createUserDocument = functions.auth.user().onCreate(async (user) => {
  try {
    const { uid, email, displayName } = user;
    
    // Create a user document in Firestore
    await db.collection('users').doc(uid).set({
      email,
      fullName: displayName || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      role: 'donor', // Default role
      bloodType: '',
      lastDonation: null,
      donationCount: 0,
      isVerified: false,
    });
    
    console.log(`User document created for ${uid}`);
    return null;
  } catch (error) {
    console.error('Error creating user document:', error);
    return null;
  }
});

// Delete user data when Firebase Auth user is deleted
exports.deleteUserData = functions.auth.user().onDelete(async (user) => {
  try {
    const { uid } = user;
    
    // Delete user document from Firestore
    await db.collection('users').doc(uid).delete();
    
    // Delete user's donations
    const donationsSnapshot = await db.collection('donations').where('userId', '==', uid).get();
    const batch = db.batch();
    donationsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete user's requests
    const requestsSnapshot = await db.collection('requests').where('userId', '==', uid).get();
    requestsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log(`User data deleted for ${uid}`);
    return null;
  } catch (error) {
    console.error('Error deleting user data:', error);
    return null;
  }
});