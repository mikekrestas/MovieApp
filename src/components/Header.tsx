// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiHeart, FiUser } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';
import { User } from 'firebase/auth';

interface HeaderProps {
  onSearch: (query: string) => void;
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ onSearch, user }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
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
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-transparent outline-none text-white placeholder-gray-400 px-2 py-1"
            placeholder="Search..."
          />
          <button type="submit" className="p-2 rounded-lg hover:bg-cyan-500 hover:text-white text-cyan-400 transition">
            <FaSearch />
          </button>
        </form>
        {/* Right: User/Auth */}
        <div className="flex items-center gap-2 justify-end">
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
