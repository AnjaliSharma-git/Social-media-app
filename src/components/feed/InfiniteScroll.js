import React, { useState, useEffect, useCallback } from 'react';
import { fetchPosts } from '../services/postService';
import PostCard from './PostCard';

const InfiniteScroll = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newPosts = await fetchPosts(page);
      
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop 
        >= document.documentElement.offsetHeight - 100
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePosts]);

  return (
    <div className="feed-container">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      {loading && <div>Loading more posts...</div>}
      {!hasMore && <div>No more posts to load</div>}
    </div>
  );
};

export default InfiniteScroll;