// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const userRole = localStorage.getItem('userRole');

  if (userRole !== requiredRole) {
    // 🚫 Si no tiene el rol necesario, lo mandamos a la tienda u otra página pública
    return <Navigate to="/tienda" replace />;
  }

  // ✅ Si tiene el rol correcto, renderiza el componente normalmente
  return children;
};

export default ProtectedRoute;
