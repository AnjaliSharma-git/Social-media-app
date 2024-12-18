import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchPosts, createPost, deletePost } from '../services/postService';
import { AuthContext } from './AuthContext';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const loadPosts = async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const newPosts = await fetchPosts(page, limit);
      setPosts(prevPosts => 
        page === 1 ? newPosts : [...prevPosts, ...newPosts]
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (postData) => {
    if (!user) {
      setError(new Error('User must be logged in to create a post'));
      return null;
    }

    try {
      const newPost = await createPost({
        ...postData,
        userId: user.uid,
        userName: user.displayName,
        userAvatar: user.photoURL
      });
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      return newPost;
    } catch (err) {
      setError(err);
      return null;
    }
  };

  const removePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (err) {
      setError(err);
    }
  };

  return (
    <PostContext.Provider 
      value={{ 
        posts, 
        loading, 
        error, 
        loadPosts, 
        addPost, 
        removePost 
      }}
    >
      {children}
    </PostContext.Provider>
  );
};