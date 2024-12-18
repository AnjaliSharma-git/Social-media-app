// src/components/feed/CreatePostForm.js
import React, { useState } from 'react';
import { createPost } from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';

const CreatePostForm = () => {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const { currentUser } = useAuth();

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost(currentUser.uid, content, files);
      setContent('');
      setFiles([]);
    } catch (error) {
      console.error('Post creation failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md">
      <textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-2 border rounded"
      />
      <input 
        type="file" 
        multiple 
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="mt-2"
      />
      <button 
        type="submit" 
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Post
      </button>
    </form>
  );
};

export default CreatePostForm;