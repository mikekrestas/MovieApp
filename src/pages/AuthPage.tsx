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
        const usernameInput = (e.target as HTMLFormElement).elements.namedItem('username') as HTMLInputElement;
        const username = usernameInput.value;
  
        await signUp(username, email, password);
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

  // Define styles here
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    background: '#fff',
  };

  const buttonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    fontSize: '16px',
    fontWeight: 'bold' as 'bold',
    width: '100%',
  };

  const googleButtonStyle: CSSProperties = {
    ...buttonStyle,
    background: '#db4437',
    color: 'white',
  };

  const iconStyle: CSSProperties = {
    marginRight: '10px',
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  const linkStyle: CSSProperties = {
    color: '#007bff',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f4f4' }}>
      <div style={containerStyle}>
        <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Username"
              name="username" // Ensure this name matches the target reference
              style={inputStyle}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={{ ...buttonStyle, background: '#34A853' }}>
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <button onClick={handleGoogleSignIn} style={googleButtonStyle}>
          <FcGoogle style={iconStyle} /> {isSignUp ? 'Sign Up with Google' : 'Login with Google'}
        </button>
        <p style={{ marginTop: '20px' }}>
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <span style={linkStyle} onClick={() => setIsSignUp(false)}>
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <span style={linkStyle} onClick={() => setIsSignUp(true)}>
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
