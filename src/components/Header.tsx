// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiHeart, FiUser } from 'react-icons/fi';
import { FaSearch, FaBell } from 'react-icons/fa';
import { User } from 'firebase/auth';
import { getBuddyRequests, acceptBuddyRequest, rejectBuddyRequest } from '../services/authService';

interface HeaderProps {
  onSearch: (query: string, type: 'movie' | 'user') => void;
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ onSearch, user }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchType, setSearchType] = React.useState<'movie' | 'user'>('movie');
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [buddyRequests, setBuddyRequests] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchRequests = async () => {
      if (user) {
        const reqs = await getBuddyRequests(user.uid);
        setBuddyRequests(reqs);
      }
    };
    fetchRequests();
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, searchType);
  };

  const handleAccept = async (requestId: string, from: string) => {
    if (!user) return;
    await acceptBuddyRequest(user.uid, requestId, from);
    setBuddyRequests(reqs => reqs.filter(r => r.id !== requestId));
  };

  const handleReject = async (requestId: string) => {
    if (!user) return;
    await rejectBuddyRequest(user.uid, requestId);
    setBuddyRequests(reqs => reqs.filter(r => r.id !== requestId));
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/10 border-b border-white/10 shadow-lg px-6 py-3">
      <div className="grid grid-cols-3 items-center w-full">
        {/* Left: Navigation */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1 px-3 py-2 rounded-xl border border-transparent hover:border-cyan-400 hover:bg-cyan-400/10 hover:shadow-md transition text-white font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400">
            <FiHome className="text-xl" /> Home
          </Link>
          <Link to="/favorites" className="flex items-center gap-1 px-3 py-2 rounded-xl border border-transparent hover:border-cyan-400 hover:bg-cyan-400/10 hover:shadow-md transition text-white font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400">
            <FiHeart className="text-xl" /> Favorites
          </Link>
        </div>
        {/* Center: Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center bg-white/10 rounded-xl px-2 py-1 border border-white/10 shadow-inner shadow-gray-900/20 max-w-md mx-auto w-full">
          <select
            value={searchType}
            onChange={e => setSearchType(e.target.value as 'movie' | 'user')}
            className="mr-2 px-2 py-1 rounded border border-cyan-400 bg-gray-900/80 text-cyan-200 text-sm"
            style={{ minWidth: 80 }}
          >
            <option value="movie">Movies</option>
            <option value="user">Users</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-transparent outline-none text-white placeholder-gray-400 px-2 py-1"
            placeholder={searchType === 'movie' ? 'Search for a movie...' : 'Search for a user...'}
          />
          <button type="submit" className="p-2 rounded-lg hover:bg-cyan-500 hover:text-white text-cyan-400 transition">
            <FaSearch />
          </button>
        </form>
        {/* Right: User/Auth */}
        <div className="flex items-center gap-2 justify-end">
          {user && (
            <div className="relative">
              <button
                className="relative p-2 rounded-full hover:bg-cyan-900/40 text-cyan-300 focus:outline-none"
                onClick={() => setShowDropdown(v => !v)}
                title="Notifications"
              >
                <FaBell className="text-2xl" />
                {buddyRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{buddyRequests.length}</span>
                )}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-cyan-400 rounded-xl shadow-xl z-50 p-4">
                  <div className="font-semibold text-cyan-300 mb-2">Buddy Requests</div>
                  {buddyRequests.length === 0 ? (
                    <div className="text-gray-400 text-sm">No new requests.</div>
                  ) : (
                    buddyRequests.map(req => (
                      <div key={req.id} className="flex flex-col gap-2 mb-3 bg-cyan-900/30 rounded-lg p-3 shadow-md">
                        <div className="text-white font-semibold text-sm mb-2">
                          {req.fromUsername ? `${req.fromUsername} would like to be your buddy` : `${req.from} would like to be your buddy`}
                        </div>
                        <div className="flex gap-3 justify-end">
                          <button
                            className="px-4 py-1 rounded bg-green-500 hover:bg-green-400 text-white text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-green-300"
                            onClick={() => handleAccept(req.id, req.from)}
                          >Accept</button>
                          <button
                            className="px-4 py-1 rounded bg-red-500 hover:bg-red-400 text-white text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-red-300"
                            onClick={() => handleReject(req.id)}
                          >Reject</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
          {user ? (
            <Link to="/profile" className="flex items-center text-white hover:text-cyan-400 transition">
              <FiUser className="text-xl" />
            </Link>
          ) : (
            <>
              <Link to="/signup" className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold transition shadow-md">Sign Up</Link>
              <Link to="/login" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-white text-cyan-400 font-semibold transition shadow-md border border-cyan-400">Login</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
