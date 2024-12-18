// src/components/auth/GoogleLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '../../services/authService';

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      await loginWithGoogle();
      navigate('/feed');
    } catch (err) {
      console.error('Google login error:', err);
      
      switch (err.code) {
        case 'auth/popup-blocked':
          setError('Login popup was blocked. Please allow popups and try again.');
          break;
        case 'auth/popup-closed-by-user':
          setError('Google login was cancelled.');
          break;
        default:
          setError('Google login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className={`w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
        }`}
      >
        <svg 
          className="w-5 h-5 mr-2" 
          viewBox="0 0 48 48" 
          fill="currentColor"
        >
          <path 
            fill="#FFC107" 
            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
          />
          <path 
            fill="#FF3D00" 
            d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
          />
          <path 
            fill="#4CAF50" 
            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.951l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
          />
          <path 
            fill="#1976D2" 
            d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.801 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
          />
        </svg>
        {loading ? 'Signing in...' : 'Continue with Google'}
      </button>
      
      {error && (<div className="mt-2 text-red-600 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default GoogleLogin;