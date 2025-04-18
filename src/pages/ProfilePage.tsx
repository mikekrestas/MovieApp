import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { logout } from '../services/authService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface ProfilePageProps {
  user: User | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData?.username || null);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800">
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-lg flex flex-col items-center relative">
        {user ? (
          <>
            <img
              src={user.photoURL || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-cyan-400 shadow-lg mb-4 object-cover bg-gray-800"
            />
            <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">Hi, {username || user.displayName || 'No Name'}</h2>
            <p className="text-gray-300 mb-6">{user.email}</p>
            <div className="w-full flex flex-col items-center">
              <div className="flex flex-col sm:flex-row gap-4 w-full mb-6 justify-center">
                <button
                  className="flex-1 flex flex-col items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-4 shadow-lg shadow-cyan-900/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  onClick={() => navigate('/favorites')}
                >
                  <span className="text-2xl mb-1"><i className="fa-solid fa-heart"></i></span>
                  Favorites
                </button>
                <button
                  className="flex-1 flex flex-col items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-4 shadow-lg shadow-cyan-900/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  onClick={() => navigate('/watchlist')}
                >
                  <span className="text-2xl mb-1"><i className="fa-solid fa-bookmark"></i></span>
                  Watchlist
                </button>
                <button
                  className="flex-1 flex flex-col items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-4 shadow-lg shadow-cyan-900/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  onClick={() => navigate('/films')}
                >
                  <span className="text-2xl mb-1"><i className="fa-solid fa-film"></i></span>
                  Films
                </button>
              </div>
              <button
                className="w-full rounded-xl border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white font-semibold py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <p className="text-white text-lg">No user logged in.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
