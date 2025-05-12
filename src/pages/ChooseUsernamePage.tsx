import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { auth } from '../firebase';

const ChooseUsernamePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const trimmed = username.trim().toLowerCase();
    if (!trimmed.match(/^[a-z0-9_]{3,20}$/)) {
      setError('Username must be 3-20 characters, lowercase letters, numbers, or underscores.');
      setLoading(false);
      return;
    }
    // Check uniqueness
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', trimmed));
    const snapshot = await getDocs(q);
    if (!auth.currentUser) {
      setError('Not logged in.');
      setLoading(false);
      return;
    }
    if (!snapshot.empty) {
      setError('Username already taken.');
      setLoading(false);
      return;
    }
    // Save username
    await setDoc(doc(db, 'users', auth.currentUser.uid), { username: trimmed }, { merge: true });
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800">
      <form onSubmit={handleSubmit} className="bg-black/10 p-8 rounded-2xl shadow-xl flex flex-col items-center w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Choose a Username</h2>
        <input
          className="mb-3 px-4 py-2 rounded w-full text-lg border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-black"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter your unique username"
          disabled={loading}
        />
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-lg mt-2"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Username'}
        </button>
      </form>
    </div>
  );
};

export default ChooseUsernamePage;
