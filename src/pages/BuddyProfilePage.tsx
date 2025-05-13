import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { UserProfile, getFavorites, getFilms, getWatchlist, sendBuddyRequest, cancelBuddyRequest, getBuddies, getBuddyRequests } from '../services/authService';
import { calculateTasteMatch, TasteMatchBreakdown } from '../services/matchService';
import { useAuthState } from 'react-firebase-hooks/auth';

const BuddyProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const [match, setMatch] = useState<TasteMatchBreakdown | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [isBuddy, setIsBuddy] = useState(false);
  const [requestPending, setRequestPending] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchTasteMatch = async () => {
      if (!user || !userId || user.uid === userId) return;
      setMatchLoading(true);
      try {
        const [myFav, myFilms, myWatch, buddyFav, buddyFilms, buddyWatch] = await Promise.all([
          getFavorites(user.uid),
          getFilms(user.uid),
          getWatchlist(user.uid),
          getFavorites(userId),
          getFilms(userId),
          getWatchlist(userId),
        ]);
        const result = calculateTasteMatch(
          { favorites: myFav, films: myFilms, watchlist: myWatch },
          { favorites: buddyFav, films: buddyFilms, watchlist: buddyWatch }
        );
        setMatch(result);
      } catch (e) {
        setMatch(null);
      }
      setMatchLoading(false);
    };
    fetchTasteMatch();
  }, [user, userId]);

  useEffect(() => {
    const checkBuddyStatus = async () => {
      if (!user || !userId || user.uid === userId) return;
      // Check if already buddies
      const buddies = await getBuddies(user.uid);
      setIsBuddy(buddies.some(b => b.userId === userId));
      // Check if a request is pending (sent by current user)
      const reqs = await getBuddyRequests(userId);
      const sentReq = reqs.find(r => r.from === user.uid && r.to === userId && r.status === 'pending');
      setRequestPending(!!sentReq);
      setRequestId(sentReq && sentReq.id ? sentReq.id : null);
    };
    checkBuddyStatus();
  }, [user, userId]);

  const handleAddBuddy = async () => {
    if (!user || !userId) return;
    await sendBuddyRequest(user.uid, userId);
    setRequestPending(true);
  };

  const handleCancelRequest = async () => {
    if (!user || !userId) return;
    await cancelBuddyRequest(user.uid, userId);
    setRequestPending(false);
  };

  if (loading) return <div className="text-center text-cyan-300 mt-24">Loading profile...</div>;
  if (!profile) return <div className="text-center text-gray-400 mt-24">Profile not found.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800">
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-lg flex flex-col items-center relative">
        {/* Add Buddy/Cancel Request button at top right */}
        {user && user.uid !== profile.userId && !isBuddy && (
          <div className="absolute top-4 right-4 z-10">
            {!requestPending ? (
              <button
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-semibold shadow"
                onClick={handleAddBuddy}
              >
                Add Buddy
              </button>
            ) : (
              <button
                className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-400 text-white font-semibold shadow"
                onClick={handleCancelRequest}
              >
                Cancel Request
              </button>
            )}
          </div>
        )}
        <img
          src={profile.photoURL || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-cyan-400 shadow-lg mb-4 object-cover bg-gray-800"
        />
        <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">{profile.username}</h2>
        {user && user.uid !== profile.userId && (
          <div className="w-full flex flex-col items-center mb-6">
            <div className="flex flex-col items-center bg-cyan-900/40 border border-cyan-400 rounded-xl p-4 shadow-lg w-full max-w-md">
              <div className="text-lg font-bold text-cyan-300 mb-1">Taste Match</div>
              {matchLoading ? (
                <div className="text-cyan-200">Calculating...</div>
              ) : match ? (
                <>
                  <div className="text-4xl font-extrabold text-cyan-400 mb-2">{match.overall}%</div>
                  <div className="w-full flex flex-wrap gap-2 justify-center text-xs text-cyan-200">
                    <div className="bg-cyan-800/60 rounded px-2 py-1">Favorites: <span className="font-bold">{match.favorites}%</span></div>
                    <div className="bg-cyan-800/60 rounded px-2 py-1">Watched: <span className="font-bold">{match.films}%</span></div>
                    <div className="bg-cyan-800/60 rounded px-2 py-1">Watchlist: <span className="font-bold">{match.watchlist}%</span></div>
                    <div className="bg-cyan-800/60 rounded px-2 py-1">Genres: <span className="font-bold">{match.genres}%</span></div>
                    <div className="bg-cyan-800/60 rounded px-2 py-1">Directors: <span className="font-bold">{match.directors}%</span></div>
                    <div className="bg-cyan-800/60 rounded px-2 py-1">Actors: <span className="font-bold">{match.actors}%</span></div>
                    <div className="bg-cyan-800/60 rounded px-2 py-1">Decades: <span className="font-bold">{match.decades}%</span></div>
                  </div>
                </>
              ) : (
                <div className="text-cyan-200">Could not calculate match.</div>
              )}
            </div>
          </div>
        )}
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
