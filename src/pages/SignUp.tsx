import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; // This component handles user sign-up and updates Firebase Auth and Firestore

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Optionally set displayName on Firebase Auth
            await updateProfile(user, { displayName });

            // ✅ Confirm user is signed in
            if (!user.uid) throw new Error('User ID not available');

            const userData = {
                uid: user.uid,
                displayName,
                email: user.email,
            };

            console.log("Preparing to write user data to Firestore:", userData);

            // ✅ Write to /users/{user.uid}
            await setDoc(doc(db, 'users', user.uid), userData);

            console.log("✅ User document successfully written!");

            navigate('/');
        } catch (error: any) {
            console.error("❌ Error writing user document:", error);
            alert(error.message);
        }
    };



    return (
        <form onSubmit={handleSignUp} className="max-w-sm mx-auto mt-10 bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-2xl font-bold">Create Account</h2>
            <input
                className="w-full p-2 border rounded"
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                required
            />
            <input
                className="w-full p-2 border rounded"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                className="w-full p-2 border rounded"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" type="submit">
                Sign Up
            </button>
        </form>
    );
}
