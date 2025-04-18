import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { FcGoogle } from 'react-icons/fc';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; 

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error: any) {
      setError('Invalid credentials. Please try again.');
      console.error('Error logging in with email and password:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Logged in User:', user);
      console.log('Google User Photo URL:', user.photoURL);
      navigate('/'); 
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password reset requested for:', resetEmail); // Add this line
    setResetMessage('');
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage('Password reset email sent! Check your inbox.');
      setShowReset(false); // Close the form after sending
      setResetEmail(''); // Optionally clear the email field
    } catch (error: any) {
      console.error('Password reset error:', error);
      setResetMessage('Failed to send reset email. Please check your email address.');
    }
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800">
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center relative">
        <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">Login</h2>
        {error && <div className="mb-4 text-red-400 text-sm font-medium w-full text-center">{error}</div>}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username or Email"
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
            type="submit"
            className="w-full py-3 mt-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold shadow-lg shadow-cyan-900/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            Login
          </button>
        </form>
        <button
          type="button"
          className="w-full text-cyan-400 hover:underline text-sm mt-1"
          onClick={() => setShowReset(!showReset)}
        >
          Forgot your password?
        </button>
        {showReset && (
          <form onSubmit={handlePasswordReset} className="w-full flex flex-col gap-2 mt-2 bg-white/5 p-4 rounded-xl border border-cyan-400">
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className="px-3 py-2 rounded bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
            <button type="submit" className="rounded bg-cyan-500 hover:bg-cyan-400 text-white py-2 font-semibold">Send Reset Link</button>
            {resetMessage && <div className="text-sm text-center text-cyan-300 mt-1">{resetMessage}</div>}
          </form>
        )}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 shadow-md shadow-gray-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        >
          <FcGoogle className="text-2xl" /> Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
