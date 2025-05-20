// Firebase Firestore Database Service
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import app from './config';

// Initialize Firestore
const db = getFirestore(app);

// ===== User Operations =====

// Create a new user document
export const createUser = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return await getUser(userId);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Get a user by ID
export const getUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Update a user
export const updateUser = async (userId, userData) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...userData,
      updatedAt: serverTimestamp()
    });
    return await getUser(userId);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// ===== Blood Request Operations =====

// Create a new blood request
export const createBloodRequest = async (requestData) => {
  try {
    const docRef = await addDoc(collection(db, 'requests'), {
      ...requestData,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...requestData };
  } catch (error) {
    console.error('Error creating blood request:', error);
    throw error;
  }
};

// Get a blood request by ID
export const getBloodRequest = async (requestId) => {
  try {
    const requestDoc = await getDoc(doc(db, 'requests', requestId));
    if (!requestDoc.exists()) {
      throw new Error('Blood request not found');
    }
    return { id: requestDoc.id, ...requestDoc.data() };
  } catch (error) {
    console.error('Error getting blood request:', error);
    throw error;
  }
};

// Update a blood request
export const updateBloodRequest = async (requestId, requestData) => {
  try {
    await updateDoc(doc(db, 'requests', requestId), {
      ...requestData,
      updatedAt: serverTimestamp()
    });
    return await getBloodRequest(requestId);
  } catch (error) {
    console.error('Error updating blood request:', error);
    throw error;
  }
};

// Delete a blood request
export const deleteBloodRequest = async (requestId) => {
  try {
    await deleteDoc(doc(db, 'requests', requestId));
  } catch (error) {
    console.error('Error deleting blood request:', error);
    throw error;
  }
};

// Get blood requests by user ID
export const getUserBloodRequests = async (userId) => {
  try {
    const q = query(
      collection(db, 'requests'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    return requests;
  } catch (error) {
    console.error('Error getting user blood requests:', error);
    throw error;
  }
};

// Get nearby blood requests
export const getNearbyBloodRequests = async (bloodType, lastVisible = null, itemsPerPage = 10) => {
  try {
    let q;
    if (lastVisible) {
      q = query(
        collection(db, 'requests'),
        where('status', '==', 'active'),
        where('bloodType', '==', bloodType),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(itemsPerPage)
      );
    } else {
      q = query(
        collection(db, 'requests'),
        where('status', '==', 'active'),
        where('bloodType', '==', bloodType),
        orderBy('createdAt', 'desc'),
        limit(itemsPerPage)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return {
      requests,
      lastVisible: lastDoc
    };
  } catch (error) {
    console.error('Error getting nearby blood requests:', error);
    throw error;
  }
};

// ===== Donation Operations =====

// Create a new donation record
export const createDonation = async (donationData) => {
  try {
    const docRef = await addDoc(collection(db, 'donations'), {
      ...donationData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...donationData };
  } catch (error) {
    console.error('Error creating donation:', error);
    throw error;
  }
};

// Get a donation by ID
export const getDonation = async (donationId) => {
  try {
    const donationDoc = await getDoc(doc(db, 'donations', donationId));
    if (!donationDoc.exists()) {
      throw new Error('Donation not found');
    }
    return { id: donationDoc.id, ...donationDoc.data() };
  } catch (error) {
    console.error('Error getting donation:', error);
    throw error;
  }
};

// Get user donations
export const getUserDonations = async (userId) => {
  try {
    const q = query(
      collection(db, 'donations'),
      where('donorId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const donations = [];
    querySnapshot.forEach((doc) => {
      donations.push({ id: doc.id, ...doc.data() });
    });
    return donations;
  } catch (error) {
    console.error('Error getting user donations:', error);
    throw error;
  }
};

// ===== Real-time Listeners =====

// Listen to a document
export const listenToDocument = (collectionName, documentId, callback) => {
  return onSnapshot(doc(db, collectionName, documentId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  });
};

// Listen to a collection with query
export const listenToCollection = (collectionName, queryConstraints, callback) => {
  const q = query(collection(db, collectionName), ...queryConstraints);
  return onSnapshot(q, (querySnapshot) => {
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    callback(items);
  });
};

export default db;