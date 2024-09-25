import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../services/authService'; // Ensure this function handles username
import { loginWithGoogle } from '../services/authService';
import { FcGoogle } from 'react-icons/fc';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Import eye icons
import { CSSProperties } from 'react';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Added username state
  const [error, setError] = useState(''); // Added error state
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      await signUp(username, email, password);
      navigate('/');
    } catch (error: unknown) { // Declare error as unknown
      if (error instanceof Error) {
        setError(error.message); // Set the error message
        console.error('Error signing up:', error.message);
      } else {
        setError('An unexpected error occurred.'); // Fallback for unexpected errors
      }
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

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div style={containerStyle}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={inputStyle}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <div style={{ position: 'relative' }}>
        <input
          type={isPasswordVisible ? 'text' : 'password'} // Toggle password visibility
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <span
          onClick={togglePasswordVisibility}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: '#666', // Darker color for better visibility
            fontSize: '18px', // Adjust size if needed
          }}
        >
          {isPasswordVisible ? <AiFillEyeInvisible /> : <AiFillEye />} 
        </span>
      </div>
      <button onClick={handleSignUp} style={buttonStyle}>Sign Up</button>
      <button onClick={handleGoogleSignIn} style={googleButtonStyle}>
        <FcGoogle size={24} /> Sign up with Google
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
  marginTop: '10px',
  width: "300px",
  backgroundColor: '#fff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default SignUp;
