// src/pages/ProfilePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { logout } from '../services/authService';
import { Container, Typography, Button, Card, CardContent, Grid } from '@mui/material';

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
    <Container style={containerStyle}>
      {user ? (
        <div style={profileContainerStyle}>
          <Typography variant="h4" style={headerStyle}>
            Hi, {user.displayName || 'No Name'}
          </Typography>
          <div style={profileInfoStyle}>
            <img 
              src={user.photoURL || 'https://via.placeholder.com/150'} 
              alt="Profile"
              style={profileImageStyle} 
            />
          </div>
          <Grid container spacing={2} justifyContent="center" style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={6}>
              <Card style={{ backgroundColor: '#333' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom style={{ color: 'white' }}>
                    Favorites
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    onClick={() => navigate('/favorites')}
                  >
                    Go to Favorites
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card style={{ backgroundColor: '#333' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom style={{ color: 'white' }}>
                    Watchlist
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    onClick={() => navigate('/watchlist')}
                  >
                    Go to Watchlist
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Button onClick={handleLogout} style={buttonStyle}>
            Logout
          </Button>
        </div>
      ) : (
        <Typography variant="h6" style={{ color: 'white' }}>
          No user logged in.
        </Typography>
      )}
    </Container>
  );
};

// Define styles using React.CSSProperties for proper typing
const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: 'rgb(40, 44, 68)',
  padding: '20px',
};

const profileContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column', // Change this line
  alignItems: 'center',
  backgroundColor: 'rgb(20, 60, 50)',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  padding: '20px',
  width: '100%',
  maxWidth: '500px',
};

const headerStyle: React.CSSProperties = {
  marginBottom: '20px',
  color: 'white',
};

const profileInfoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '20px',
};

const profileImageStyle: React.CSSProperties = {
  width: '150px',
  height: '150px',
  borderRadius: '75px',
  border: '3px solid #ddd',
  objectFit: 'cover',
};

const buttonStyle: React.CSSProperties = {
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
