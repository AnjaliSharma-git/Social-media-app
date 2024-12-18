// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  collection, 
  where, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import Navigation from '../components/common/Navigation';
import PostCard from '../components/feed/PostCard';


const Profile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
          setBio(userDoc.data().bio || '');
        }

        // Fetch user posts
        const postsQuery = query(
          collection(db, 'posts'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const postsSnapshot = await getDocs(postsQuery);
        setUserPosts(postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update user document with new profile image
      await updateDoc(doc(db, 'users', currentUser.uid), {
        photoURL: downloadURL
      });

      setProfile(prev => ({ ...prev, photoURL: downloadURL }));
    } catch (error) {
      console.error('Profile image upload failed:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        bio
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <div className="relative">
          <img 
            src={profile.photoURL || '/default-avatar.png'} 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover"
          />
          {currentUser.uid === userId && (
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          )}
        </div>

        <h2 className="text-2xl font-bold mt-4">{profile.displayName}</h2>
        
        {isEditing ? (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full mt-2 p-2 border rounded"
            placeholder="Enter your bio"
          />
        ) : (
          <p className="text-gray-600 mt-2">{bio}</p>
        )}

        {currentUser.uid === userId && (
          <button 
            onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            {isEditing ? 'Save' : 'Edit Profile'}
          </button>
        )}

        <div className="w-full mt-8">
          <h3 className="text-xl font-semibold mb-4">My Posts</h3>
          {userPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default Profile;
