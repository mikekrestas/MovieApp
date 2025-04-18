import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../services/authService';
import { loginWithGoogle } from '../services/authService';
import { FcGoogle } from 'react-icons/fc';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setError('');
    try {
      await signUp(username, email, password);
      navigate('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        console.error('Error signing up:', error.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Google sign up failed.');
      console.error('Error signing in with Google:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800">
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center relative">
        <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">Sign Up</h2>
        {error && <div className="mb-4 text-red-400 text-sm font-medium w-full text-center">{error}</div>}
        <div className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner shadow-gray-900/30 transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner shadow-gray-900/30 transition"
          />
          <div className="relative w-full">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner shadow-gray-900/30 transition"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 cursor-pointer hover:text-cyan-400 transition"
            >
              {isPasswordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
          <button
            onClick={handleSignUp}
            className="w-full py-3 mt-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold shadow-lg shadow-cyan-900/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            Sign Up
          </button>
        </div>
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 shadow-md shadow-gray-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        >
          <FcGoogle className="text-2xl" /> Sign up with Google
        </button>
      </div>
    </div>
  );
};

export default SignUp;
