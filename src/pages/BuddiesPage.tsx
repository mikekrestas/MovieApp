import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBuddies, UserProfile, searchUsersByUsername, removeBuddy } from '../services/authService';

interface BuddiesPageProps {
  userId: string;
  readOnly?: boolean;
}

const BuddiesPage: React.FC<BuddiesPageProps> = ({ userId, readOnly }) => {
  const [buddies, setBuddies] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingBuddy, setRemovingBuddy] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRemoveBuddy = async (buddyId: string) => {
    setRemovingBuddy(buddyId);
    await removeBuddy(userId, buddyId);
    setBuddies(buddies.filter(b => b.userId !== buddyId));
    setRemovingBuddy(null);
  };

  useEffect(() => {
    const fetchBuddies = async () => {
      setLoading(true);
      const buddyLinks = await getBuddies(userId);
      const buddyIds = buddyLinks.map(b => b.userId);
      const buddyProfiles = buddyIds.length > 0 ? await searchUsersByUsername('', undefined) : [];
      setBuddies(buddyProfiles.filter(u => buddyIds.includes(u.userId)));
      setLoading(false);
    };
    fetchBuddies();
  }, [userId]);

  return (
    <div className="min-h-screen pt-24 flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800">
      <h1 className="text-4xl font-bold text-white mb-6">Buddies</h1>
      {loading ? (
        <div className="text-cyan-300">Loading...</div>
      ) : buddies.length === 0 ? (
        <div className="text-gray-400">No buddies yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full max-w-4xl">
          {buddies.map(buddy => (
            <div
              key={buddy.userId}
              className="flex flex-col items-center bg-gray-900/80 rounded-xl p-4 border border-cyan-700 shadow cursor-pointer hover:bg-cyan-900/60 transition relative"
              onClick={() => navigate(`/profile/${buddy.userId}`)}
            >
              <img
                src={buddy.photoURL || 'https://via.placeholder.com/100'}
                alt={buddy.username}
                className="w-20 h-20 rounded-full mb-2 object-cover border-2 border-cyan-400"
              />
              <div className="font-semibold text-white mb-1">{buddy.username}</div>
              
              {!readOnly && (
                <button
                  className="absolute top-2 right-2 px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow"
                  onClick={e => { e.stopPropagation(); setRemovingBuddy(buddy.userId); }}
                  title="Remove Buddy"
                >Remove</button>
              )}
              {!readOnly && removingBuddy === buddy.userId && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl z-10">
                  <div className="bg-gray-800 p-4 rounded-xl border border-cyan-400 flex flex-col items-center">
                    <div className="text-white mb-2">Remove {buddy.username} as a buddy?</div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
                        onClick={async e => { e.stopPropagation(); await handleRemoveBuddy(buddy.userId); }}
                      >Yes, Remove</button>
                      <button
                        className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 text-white text-xs font-semibold"
                        onClick={e => { e.stopPropagation(); setRemovingBuddy(null); }}
                      >Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuddiesPage;
