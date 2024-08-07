// src/pages/SignUp.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, loginWithGoogle } from '../services/authService';
import { FcGoogle } from 'react-icons/fc';
import { CSSProperties } from 'react';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />
      <button onClick={handleSignUp} style={buttonStyle}>Sign Up</button>
      <button onClick={handleGoogleSignIn} style={googleButtonStyle}>
        <FcGoogle size={24} /> Sign in with Google
      </button>
    </div>
  );
};

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '300px', // Ensure form width consistency
};

const inputStyle: CSSProperties = {
  margin: '10px 0',
  padding: '10px',
  width: '300px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle: CSSProperties = {
  padding: '10px 20px',
  margin: '10px 0',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#007bff',
  width: "300px",
  color: 'white',
  cursor: 'pointer',
};

const googleButtonStyle: CSSProperties = {
  padding: '10px 20px',
  margin: '10px 0',
  color: '#000',
  borderRadius: '4px',
  border: 'none',
  marginTop: '10px', // Ensure margin consistency
  width: "300px",
  backgroundColor: '#fff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default SignUp;
