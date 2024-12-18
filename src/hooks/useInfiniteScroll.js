// src/hooks/useInfiniteScroll.js
import { useState, useCallback, useEffect } from 'react';
import { fetchPosts } from '../services/postService';

export const useInfiniteScroll = () => {
  const [posts, setPosts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      const { posts: newPosts, lastVisible: newLastVisible } = await fetchPosts(lastVisible);
      
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setLastVisible(newLastVisible);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }, [lastVisible, loading]);

  useEffect(() => {
    loadPosts();
  }, []);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop 
      >= document.documentElement.offsetHeight - 100 && 
      !loading && 
      hasMore
    ) {
      loadPosts();
    }
  }, [loadPosts, loading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { posts, loading, hasMore };
};