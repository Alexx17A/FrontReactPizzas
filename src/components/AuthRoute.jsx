import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

const AuthRoute = ({ children, adminOnly = true }) => {
  const [authStatus, setAuthStatus] = useState({
    loading: true,
    isAuthenticated: false,
    isAdmin: false
  });

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await api.get('/auth/user');
        setAuthStatus({
          loading: false,
          isAuthenticated: true,
          isAdmin: response.data.roles.includes('ROLE_ADMIN')
        });
      } catch (error) {
        console.error('Auth verification failed:', error);
        setAuthStatus({
          loading: false,
          isAuthenticated: false,
          isAdmin: false
        });
      }
    };

    verifyAuth();
  }, []);

  if (authStatus.loading) {
    return <div>Cargando...</div>;
  }

  if (!authStatus.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !authStatus.isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AuthRoute;