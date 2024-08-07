// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, login, loginWithGoogle } from '../services/authService';
import { FcGoogle } from 'react-icons/fc';
import { CSSProperties } from 'react';

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
  };

  const buttonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    background: '#4285F4',
    color: 'white',
    cursor: 'pointer',
    marginTop: '10px',
  };

  const iconStyle: CSSProperties = {
    marginRight: '10px',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={containerStyle}>
        <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Username"
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            required
          />
          <button type="submit" style={{ ...buttonStyle, background: '#34A853' }}>
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <button onClick={handleGoogleSignIn} style={buttonStyle}>
          <FcGoogle style={iconStyle} /> {isSignUp ? 'Sign Up with Google' : 'Login with Google'}
        </button>
        <p style={{ marginTop: '10px' }}>
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setIsSignUp(false)}>
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setIsSignUp(true)}>
                Sign up here
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
