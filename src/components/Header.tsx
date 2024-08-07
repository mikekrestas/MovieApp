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
    <header style={headerStyle}>
      <div style={leftContainerStyle}>
        <Link to="/" style={linkStyle}>
          <FiHome style={iconStyle} />
          Home
        </Link>
        <Link to="/favorites" style={linkStyle}>
          <FiHeart style={iconStyle} />
          Favorites
        </Link>
      </div>
      <form onSubmit={handleSearch} style={searchFormStyle}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={searchInputStyle}
          placeholder="Search..."
        />
        <button type="submit" style={searchButtonStyle}>
          <FaSearch />
        </button>
      </form>
      <div style={rightContainerStyle}>
        {user ? (
          <Link to="/profile" style={linkStyle}>
            <FiUser style={iconStyle} />
          </Link>
        ) : (
          <>
            <Link to="/signup" style={linkStyle}>
              Sign Up
            </Link>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: '#282c34',
  color: 'white',
  position: 'fixed',
  top: 0,
  width: '100%',
  zIndex: 1000,
};

const leftContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const linkStyle: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  margin: '0 10px',
  display: 'flex',
  alignItems: 'center',
};

const iconStyle: React.CSSProperties = {
  marginRight: '5px',
};

const searchFormStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexGrow: 1,
  maxWidth: '500px',
  margin: '0 20px',
};

const searchInputStyle: React.CSSProperties = {
  flexGrow: 1,
  padding: '5px 10px',
  borderRadius: '4px 0 0 4px',
  border: '1px solid #ccc',
};

const searchButtonStyle: React.CSSProperties = {
  padding: '5px 10px',
  borderRadius: '0 4px 4px 0',
  border: '1px solid #ccc',
  borderLeft: 'none',
  backgroundColor: '#61dafb',
  cursor: 'pointer',
};

const rightContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

export default Header;
