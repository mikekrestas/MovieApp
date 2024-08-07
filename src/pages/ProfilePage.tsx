// src/pages/ProfilePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { logout } from '../services/authService';
import { CSSProperties } from 'react';

interface ProfilePageProps {
  user: User | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div style={containerStyle}>
      {user ? (
        <div style={profileContainerStyle}>
          <h1 style={headerStyle}>Hi, {user.displayName || 'No Name'}</h1>
          <div style={profileInfoStyle}>
            <img 
              src={user.photoURL || 'https://via.placeholder.com/150'} 
               
              style={profileImageStyle} 
            />
            {/* <div style={infoStyle}>
              <p style={infoTextStyle}><strong>Name</strong> {user.displayName || 'No Name'}</p>
              <p style={infoTextStyle}><strong>Email</strong> {user.email}</p>
            </div> */}
          </div>
          <button onClick={handleLogout} style={buttonStyle}>Logout</button>
        </div>
      ) : (
        <p>No user logged in.</p>
      )}
    </div>
  );
};

const containerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: 'rgb(40, 44, 68)',
  padding: '20px',
};

const profileContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'rgb(20, 60, 50)',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  padding: '20px',
  width: '100%',
  maxWidth: '500px',
};

const headerStyle: CSSProperties = {
  marginBottom: '20px',
  fontSize: '24px',
  color: 'white',
};

const profileInfoStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '20px',
};

const profileImageStyle: CSSProperties = {
  width: '150px',
  height: '150px',
  borderRadius: '75px',
  border: '3px solid #ddd',
  objectFit: 'cover',
};

const infoStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const infoTextStyle: CSSProperties = {
  margin: '5px 0',
  fontSize: '18px',
  color: 'white',
};

const buttonStyle: CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#2a2940',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '100%',
  maxWidth: '300px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
};

export default ProfilePage;
