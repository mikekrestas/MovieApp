// src/pages/ProfilePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { logout } from '../services/authService';

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
    <div>
      {user ? (
        <div>
          <h1>Profile</h1>
          <p>Name: {user.displayName || 'No Name'}</p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>No user logged in.</p>
      )}
    </div>
  );
};

export default ProfilePage;
