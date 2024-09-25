import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { logout } from '../services/authService';
import { Container, Typography, Button, Card, CardContent, Grid, Avatar } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import as necessary

interface ProfilePageProps {
  user: User | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid); // Adjust path as necessary
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData?.username || null); // Assuming `username` field is available
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
    <Container style={containerStyle}>
      {user ? (
        <div style={profileContainerStyle}>
          <Typography variant="h4" style={headerStyle}>
            Hi, {username || user.displayName || 'No Name'}
          </Typography>
          <Avatar
            src={user.photoURL || 'https://via.placeholder.com/150'}
            alt="Profile"
            sx={{ width: 150, height: 150, mb: 2 }}
          />

          <Grid container spacing={2} justifyContent="center" style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={6}>
              <Card style={cardStyle}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
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
              <Card style={cardStyle}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
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

          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ maxWidth: '300px', mt: 3 }}
            onClick={handleLogout}
          >
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

// Define styles using React.CSSProperties or MUI's sx for proper typing
const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#1a1a2e',
  padding: '20px',
};

const profileContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#16213e',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  padding: '30px',
  width: '100%',
  maxWidth: '500px',
  textAlign: 'center',
};

const headerStyle: React.CSSProperties = {
  marginBottom: '20px',
  color: '#fff',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#0f3460',
  color: '#fff',
};

export default ProfilePage;
