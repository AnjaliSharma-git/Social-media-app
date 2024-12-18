import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { logout } from '../services/authService';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold">
          Social Feed
        </Link>
        
        <nav className="flex space-x-4">
          {user ? (
            <>
              <Link to="/feed" className="nav-link">Feed</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              <button onClick={logout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-login">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;