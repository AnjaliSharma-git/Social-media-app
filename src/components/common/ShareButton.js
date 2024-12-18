// src/components/common/ShareButton.js
import React, { useState } from 'react';

const ShareButton = ({ post }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      action: () => {
        const postLink = `${window.location.origin}/post/${post.id}`;
        navigator.clipboard.writeText(postLink);
        alert('Link copied to clipboard!');
      }
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>
      ),
      action: () => {
        const text = encodeURIComponent(`Check out this post: ${post.content}`);
        const url = `https://twitter.com/intent/tweet?text=${text}`;
        window.open(url, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      ),
      action: () => {
        const url = encodeURIComponent(window.location.href);
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        window.open(shareUrl, '_blank');
      }
    }
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setShowShareOptions(!showShareOptions)}
        className="flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
      </button>

      {showShareOptions && (
        <div className="absolute bottom-full right-0 mb-2 bg-white shadow-lg rounded-lg p-4 flex space-x-4">
          {shareOptions.map((option) => (
            <button 
              key={option.name}
              onClick={option.action}
              className="flex flex-col items-center"
              title={option.name}
            >
              {option.icon}
              <span className="text-xs mt-1">{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShareButton;