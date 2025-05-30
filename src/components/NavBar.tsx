import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { auth } from '../lib/firebase';

export default function Navbar() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/signin');
  };

  return (
    <nav className="bg-gray-100 p-4 mb-6 shadow">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="space-x-4">
          <Link to="/" className="font-bold text-blue-600">Home</Link>
          {user && <Link to="/" className="text-blue-600">Log Meals</Link>}
          {user && <Link to="/friends" className="text-blue-600">Friends</Link>}
          {user && <Link to="/profile" className="text-blue-600">Profile</Link>}
          {!user && <Link to="/signup" className="text-blue-600">Sign Up</Link>}
          {!user && <Link to="/signin" className="text-blue-600">Sign In</Link>}
        </div>
        {user && (
          <button onClick={handleSignOut} className="bg-red-500 text-white px-3 py-1 rounded">
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
}
