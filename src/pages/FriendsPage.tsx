import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

interface UserItem {
  uid: string;
  displayName: string;
  email: string;
}

export default function FriendsPage() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserItem[]>([]);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);
  const [friendsList, setFriendsList] = useState<UserItem[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<UserItem[]>([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    const q = query(
      collection(db, 'users'),
      where('email', '==', searchTerm)
    );

    const snapshot = await getDocs(q);
    const users: UserItem[] = [];

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (docSnap.id !== user?.uid) {
        users.push({ uid: docSnap.id, displayName: data.displayName, email: data.email });
      }
    });

    setSearchResults(users);
  };

  const handleSendFriendRequest = async (friend: UserItem) => {
    if (!user) return;

    const recipientUid = friend.uid;
    const senderUid = user.uid;

    const requestRef = doc(db, 'users', recipientUid, 'friendRequests', senderUid);

    await setDoc(requestRef, {
      fromUid: senderUid,
      timestamp: serverTimestamp(),
    });
  };

  const handleAcceptRequest = async (fromUser: UserItem) => {
    if (!user) return;

    const currentUserUid = user.uid;
    const fromUserUid = fromUser.uid;

    try {
//This adds users to another user's friend list
      await setDoc(doc(db, 'users', currentUserUid, 'friends', fromUserUid), {
        friendUid: fromUserUid,
        addedAt: serverTimestamp(),
      });
      console.log(`✅ Added ${fromUserUid} to ${currentUserUid}'s friends`);

      // 2. Try to add current user to fromUser's friends list
      try {
        await setDoc(doc(db, 'users', fromUserUid, 'friends', currentUserUid), {
          friendUid: currentUserUid,
          addedAt: serverTimestamp(),
        });
        console.log(`✅ Added ${currentUserUid} to ${fromUserUid}'s friends`);
      } catch (writeErr) {
        console.error(`❌ Failed to write to ${fromUserUid}'s friends:`, writeErr);
      }

      // 3. Remove the friend request
      await deleteDoc(doc(db, 'users', currentUserUid, 'friendRequests', fromUserUid));
      console.log(`🗑️ Removed friend request from ${fromUserUid}`);

      // 4. Update UI
      setFriendsList(prev => [...prev, fromUser]);
      setIncomingRequests(prev => {
        if (prev.some(r => r.uid === fromUser.uid)) {
          return prev.filter(r => r.uid !== fromUser.uid);
        }
        return prev;
      });
    } catch (err) {
      console.error('🔥 Error accepting friend request:', err);
    }
  };


  const handleRemoveFriend = async (friendUid: string) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid, 'friends', friendUid);
    const friendRef = doc(db, 'users', friendUid, 'friends', user.uid);

    try {
      await Promise.all([
        deleteDoc(userRef),
        deleteDoc(friendRef),
      ]);
      setFriendsList(prev => prev.filter(f => f.uid !== friendUid));
    } catch (err) {
      console.error("Error removing friend:", err);
    }
  };

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, 'users', user.uid, 'friends'),
      async snapshot => {
        const friendData: UserItem[] = [];
        for (const docSnap of snapshot.docs) {
          const friendUid = docSnap.data().friendUid;
          const friendRef = doc(db, 'users', friendUid);
          const friendSnap = await getDoc(friendRef);
          if (friendSnap.exists()) {
            const data = friendSnap.data();
            friendData.push({ uid: friendSnap.id, displayName: data.displayName, email: data.email });
          }
        }
        setFriendsList(friendData);
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, 'users', user.uid, 'friendRequests'),
      async (snapshot) => {
        const requestData: UserItem[] = [];

        for (const docSnap of snapshot.docs) {
          const fromUid = docSnap.id;
          const fromDoc = await getDoc(doc(db, 'users', fromUid));
          if (fromDoc.exists()) {
            const data = fromDoc.data();
            requestData.push({ uid: fromUid, displayName: data.displayName, email: data.email });
          }
        }

        setIncomingRequests(requestData);
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    setSearchResults([]);
  }, [searchTerm]);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Find and View Friends</h2>

      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder="Search by email"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {searchResults.map(friend => (
          <div key={friend.uid} className="p-4 bg-gray-50 rounded shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">{friend.displayName || friend.email}</p>
              <p className="text-sm text-gray-500">{friend.email}</p>
            </div>
            <button
              onClick={() => handleSendFriendRequest(friend)}
              className="px-4 py-1 rounded text-white bg-green-500 hover:bg-green-600"
            >
              Send Request
            </button>
          </div>
        ))}
      </div>

      {incomingRequests.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Friend Requests</h3>
          <div className="space-y-4">
            {incomingRequests.map(request => (
              <div key={request.uid} className="p-4 bg-yellow-100 rounded shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold">{request.displayName || request.email}</p>
                  <p className="text-sm text-gray-500">{request.email}</p>
                </div>
                <button
                  onClick={() => handleAcceptRequest(request)}
                  className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-xl font-semibold mb-4">Your Friends</h3>
      <div className="space-y-4">
        {friendsList.map(friend => (
          <div key={friend.uid} className="p-4 bg-gray-100 rounded shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">{friend.displayName || friend.email}</p>
              <p className="text-sm text-gray-500">{friend.email}</p>
            </div>
            <div className="space-x-2">
              <Link
                to={`/friends/${friend.uid}`}
                className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
              >
                View Stats
              </Link>
              <button
                onClick={() => handleRemoveFriend(friend.uid)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove Friend
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
