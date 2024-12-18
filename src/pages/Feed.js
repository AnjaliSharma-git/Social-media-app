// src/pages/Feed.js
import React from 'react';
import CreatePostForm from '../components/feed/CreatePostForm';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import PostCard from '../components/feed/PostCard';
import Navigation from '../components/common/Navigation';

const Feed = () => {
  const { posts, loading, hasMore } = useInfiniteScroll();

  return (
    <div className="container mx-auto px-4 py-8">
      <CreatePostForm />
      <div className="mt-6 space-y-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        {loading && <div>Loading more posts...</div>}
        {!hasMore && <div>No more posts to load</div>}
      </div>
      <Navigation />
    </div>
  );
};

export default Feed;
