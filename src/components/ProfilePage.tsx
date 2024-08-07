// src/pages/ProfilePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  return (
    <div style={profilePageStyle}>
      <h1>Profile</h1>
      <div style={buttonContainerStyle}>
        <Link to="/signup" style={buttonStyle}>Sign Up</Link>
        <Link to="/login" style={buttonStyle}>Login</Link>
      </div>
    </div>
  );
};

const profilePageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  textDecoration: 'none',
  backgroundColor: '#333',
  color: '#fff',
  borderRadius: '4px',
  textAlign: 'center',
};

export default ProfilePage;
