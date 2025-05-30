// src/utils/friendService.ts
import { db } from '../lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const addFriend = async (currentUserId: string, friendUserId: string) => {
  await setDoc(
    doc(db, 'users', currentUserId, 'friends', friendUserId),
    {
      friendUid: friendUserId,
      addedAt: serverTimestamp(),
    }
  );
};
