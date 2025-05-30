import * as functions from 'firebase-functions'; // ✅ Only this import
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const onFriendRequestAccepted = functions.firestore
  .document('users/{userId}/friends/{friendId}')
  .onCreate(async (snap, context) => {
    const userId = context.params.userId;
    const friendId = context.params.friendId;

    const reverseFriendRef = db.doc(`users/${friendId}/friends/${userId}`);
    const reverseFriendSnap = await reverseFriendRef.get();

    if (!reverseFriendSnap.exists) {
      await reverseFriendRef.set({
        friendUid: userId,
        addedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  });
