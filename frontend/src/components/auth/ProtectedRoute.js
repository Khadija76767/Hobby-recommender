import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, token, currentUser } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute check:', { isAuthenticated, loading, token: !!token, currentUser: !!currentUser });

  // إذا كان loading، انتظر
  if (loading) {
    return <div>Loading...</div>;
  }

  // فحص متعدد الطبقات للمصادقة
  const isUserAuthenticated = isAuthenticated || token || currentUser;

  if (!isUserAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ User authenticated, allowing access');
  return children;
};

export default ProtectedRoute; 