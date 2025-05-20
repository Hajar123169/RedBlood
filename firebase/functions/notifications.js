// Firebase Cloud Functions - Push Notifications
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Send notification when a new blood request is created
exports.notifyNewRequest = functions.firestore
  .document('requests/{requestId}')
  .onCreate(async (snapshot, context) => {
    try {
      const requestData = snapshot.data();
      const { bloodType, urgency, location, hospitalName } = requestData;
      
      // Find users with matching blood type
      const usersSnapshot = await db.collection('users')
        .where('role', '==', 'donor')
        .where('bloodType', '==', bloodType)
        .get();
      
      if (usersSnapshot.empty) {
        console.log('No matching donors found');
        return null;
      }
      
      // Prepare notification
      const notification = {
        title: `Urgent Blood Request: ${bloodType}`,
        body: `A ${urgency} request for ${bloodType} blood has been made at ${hospitalName}`,
        data: {
          requestId: context.params.requestId,
          bloodType,
          urgency,
          location: JSON.stringify(location),
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
          screen: 'request_details',
        },
      };
      
      // Get FCM tokens for all matching users
      const tokens = [];
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.fcmToken) {
          tokens.push(userData.fcmToken);
        }
      });
      
      if (tokens.length === 0) {
        console.log('No FCM tokens found for matching donors');
        return null;
      }
      
      // Send notifications in batches of 500 (FCM limit)
      const batchSize = 500;
      const batches = [];
      
      for (let i = 0; i < tokens.length; i += batchSize) {
        const batch = tokens.slice(i, i + batchSize);
        batches.push(batch);
      }
      
      const sendPromises = batches.map(tokenBatch => {
        return admin.messaging().sendMulticast({
          tokens: tokenBatch,
          notification: {
            title: notification.title,
            body: notification.body,
          },
          data: notification.data,
          android: {
            priority: 'high',
            notification: {
              sound: 'default',
              priority: 'high',
              channelId: 'blood_requests',
            },
          },
          apns: {
            payload: {
              aps: {
                sound: 'default',
                category: 'blood_request',
              },
            },
          },
        });
      });
      
      const results = await Promise.all(sendPromises);
      
      // Log results
      let successCount = 0;
      let failureCount = 0;
      
      results.forEach(result => {
        successCount += result.successCount;
        failureCount += result.failureCount;
      });
      
      console.log(`Successfully sent notifications to ${successCount} devices`);
      if (failureCount > 0) {
        console.log(`Failed to send notifications to ${failureCount} devices`);
      }
      
      return null;
    } catch (error) {
      console.error('Error sending notifications:', error);
      return null;
    }
  });

// Send notification when a request status is updated
exports.notifyRequestUpdate = functions.firestore
  .document('requests/{requestId}')
  .onUpdate(async (change, context) => {
    try {
      const before = change.before.data();
      const after = change.after.data();
      
      // Only send notification if status has changed
      if (before.status === after.status) {
        return null;
      }
      
      // Get request owner
      const ownerDoc = await db.collection('users').doc(after.userId).get();
      if (!ownerDoc.exists || !ownerDoc.data().fcmToken) {
        console.log('Request owner not found or has no FCM token');
        return null;
      }
      
      const ownerToken = ownerDoc.data().fcmToken;
      
      // Prepare notification based on status
      let title, body;
      
      switch (after.status) {
        case 'fulfilled':
          title = 'Blood Request Fulfilled';
          body = 'Your blood request has been fulfilled. Thank you!';
          break;
        case 'cancelled':
          title = 'Blood Request Cancelled';
          body = 'Your blood request has been cancelled.';
          break;
        case 'expired':
          title = 'Blood Request Expired';
          body = 'Your blood request has expired. You can create a new request if needed.';
          break;
        default:
          title = 'Blood Request Updated';
          body = `Your blood request status is now: ${after.status}`;
      }
      
      // Send notification to request owner
      await admin.messaging().send({
        token: ownerToken,
        notification: {
          title,
          body,
        },
        data: {
          requestId: context.params.requestId,
          status: after.status,
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
          screen: 'request_details',
        },
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            priority: 'high',
            channelId: 'blood_requests',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              category: 'blood_request',
            },
          },
        },
      });
      
      console.log(`Notification sent to request owner for status update to ${after.status}`);
      return null;
    } catch (error) {
      console.error('Error sending status update notification:', error);
      return null;
    }
  });