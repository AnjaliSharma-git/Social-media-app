// src/components/common/Navigation.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../services/authService';

const Navigation = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const menuItems = [
    { 
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'text-blue-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      path: '/feed'
    },
    { 
      icon: (active) => (
        <svg className={`w-6 h-6 ${active ? 'text-blue-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      path: `/profile/${currentUser?.uid}`
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="flex justify-around py-3 px-4">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className="flex flex-col items-center"
          >
            {item.icon(location.pathname === item.path)}
          </Link>
        ))}
        <button 
          onClick={handleLogout}
          className="flex flex-col items-center"
        >
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;