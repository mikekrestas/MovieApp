// src/components/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { FcGoogle } from 'react-icons/fc';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error('Error logging in with email and password:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  return (
    <div style={formContainerStyle}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={formStyle}>
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
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
      <button onClick={handleGoogleLogin} style={{ ...buttonStyle, ...googleButtonStyle }}>
        <FcGoogle style={googleIconStyle} /> Login with Google
      </button>
    </div>
  );
};

const formContainerStyle: React.CSSProperties = {
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

const inputStyle: React.CSSProperties = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '100%',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 0',
  backgroundColor: '#333',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '10px',
};

const googleButtonStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  color: '#000',
  border: '1px solid #ccc',
  marginTop: '10px', // Ensure margin consistency
  width: '33%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const googleIconStyle: React.CSSProperties = {
  marginRight: '8px',
  fontSize: '18px', // Adjust icon size for better visibility
};

export default Login;
