import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../services/authService';

const BuddyProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      setLoading(true);
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setProfile({ userId, ...userSnap.data() } as UserProfile);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);

  if (loading) return <div className="text-center text-cyan-300 mt-24">Loading profile...</div>;
  if (!profile) return <div className="text-center text-gray-400 mt-24">Profile not found.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800">
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-lg flex flex-col items-center relative">
        <img
          src={profile.photoURL || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-cyan-400 shadow-lg mb-4 object-cover bg-gray-800"
        />
        <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">{profile.username}</h2>
        <div className="w-full flex flex-col items-center">
          <div className="flex flex-col sm:flex-row gap-4 w-full mb-6 justify-center">
            <button
              className="flex-1 flex flex-col items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-4 shadow-lg shadow-cyan-900/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              onClick={() => navigate(`/profile/${profile.userId}/favorites`)}
            >
              <span className="text-2xl mb-1"><i className="fa-solid fa-heart"></i></span>
              Favorites
            </button>
            <button
              className="flex-1 flex flex-col items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-4 shadow-lg shadow-cyan-900/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              onClick={() => navigate(`/profile/${profile.userId}/watchlist`)}
            >
              <span className="text-2xl mb-1"><i className="fa-solid fa-bookmark"></i></span>
              Watchlist
            </button>
            <button
              className="flex-1 flex flex-col items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-4 shadow-lg shadow-cyan-900/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              onClick={() => navigate(`/profile/${profile.userId}/films`)}
            >
              <span className="text-2xl mb-1"><i className="fa-solid fa-film"></i></span>
              Films
            </button>
            <button
              className="flex-1 flex flex-col items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-4 shadow-lg shadow-cyan-900/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              onClick={() => navigate(`/profile/${profile.userId}/buddies`)}
            >
              <span className="text-2xl mb-1"><i className="fa-solid fa-user-group"></i></span>
              Buddies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuddyProfilePage;
