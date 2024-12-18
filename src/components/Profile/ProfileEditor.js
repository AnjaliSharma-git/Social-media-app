import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { updateUserProfile } from '../services/authService';

const ProfileEditor = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    profilePicture: user?.photoURL || null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    // Implement image upload and compression logic
    const uploadedImage = await uploadProfilePicture(file);
    setProfile(prev => ({
      ...prev,
      profilePicture: uploadedImage
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(profile);
      // Show success message
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-editor">
      <input
        name="displayName"
        value={profile.displayName}
        onChange={handleInputChange}
        placeholder="Display Name"
      />
      <textarea
        name="bio"
        value={profile.bio}
        onChange={handleInputChange}
        placeholder="Bio"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleProfilePictureUpload}
      />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default ProfileEditor;