// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';

// Styling
import './styles/global.css';
import './styles/tailwind.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/feed" 
              element={
                <PrivateRoute>
                  <Feed />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile/:userId" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/feed" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;