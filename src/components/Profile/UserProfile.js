import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { fetchUserPosts } from '../services/postService';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const loadUserPosts = async () => {
      if (user) {
        const posts = await fetchUserPosts(user.uid);
        setUserPosts(posts);
      }
    };
    loadUserPosts();
  }, [user]);

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img 
          src={user?.photoURL} 
          alt="Profile" 
          className="profile-picture" 
        />
        <h2>{user?.displayName}</h2>
        <p>{user?.bio}</p>
      </div>
      
      <div className="user-posts">
        {userPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default UserProfile;