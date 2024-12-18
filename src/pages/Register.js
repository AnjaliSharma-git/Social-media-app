import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginWithGoogle } from '../services/authService';
import { uploadFile } from '../services/storageService';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    profilePicture: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'profilePicture' && files[0]) {
      setFormData(prev => ({
        ...prev,
        profilePicture: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      let profilePictureUrl = null;
  
      // If a profile picture is selected, upload it to storage
      if (formData.profilePicture) {
        profilePictureUrl = await uploadFile(
          formData.profilePicture,
          `profilePictures/${formData.displayName}-${Date.now()}`
        );
      }
  
      // Register the user with the provided details
      await registerUser({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
        photoURL: profilePictureUrl, // Include the profile picture URL
      });
  
      navigate('/feed');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleGoogleSignUp = async () => {
    try {
      await loginWithGoogle();
      navigate('/feed');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input
            name="displayName"
            type="text"
            required
            value={formData.displayName}
            onChange={handleInputChange}
            placeholder="Display Name"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email address"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            name="profilePicture"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Or continue with
            </p>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Continue with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;