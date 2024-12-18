// src/components/feed/PostCard.js
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const videoElement = videoRef.current;
          if (videoElement && videoElement.paused) {
            videoElement.play();
            setIsVideoPlaying(true);
          }
        } else {
          const videoElement = videoRef.current;
          if (videoElement && !videoElement.paused) {
            videoElement.pause();
            setIsVideoPlaying(false);
          }
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [post.mediaUrls]);

  const renderMedia = () => {
    return post.mediaUrls.map((url, index) => {
      const isVideo = url.includes('.mp4') || url.includes('.mov');
      
      return isVideo ? (
        <video
          key={index}
          ref={videoRef}
          src={url}
          className="w-full h-auto object-cover"
          muted
          playsInline
        />
      ) : (
        <img
          key={index}
          src={url}
          alt={`Post media ${index + 1}`}
          className="w-full h-auto object-cover"
        />
      );
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        <Link to={`/profile/${post.userId}`} className="flex items-center mb-4">
          <img 
            src={post.userPhotoURL || '/default-avatar.png'} 
            alt="User avatar" 
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="font-semibold">{post.userName}</span>
        </Link>
        
        {post.content && (
          <p className="text-gray-700 mb-4">{post.content}</p>
        )}
        
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {renderMedia()}
          </div>
        )}
        
        <div className="flex justify-between mt-4 text-gray-600">
          <button className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {post.likes || 0}
          </button>
          <button className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.comments || 0}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;