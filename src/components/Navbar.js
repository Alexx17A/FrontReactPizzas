// src/components/Sidebar.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/sidebar.css';
import axios from 'axios';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await axios.post('/api/auth/signout', {}, { 
        withCredentials: true // Important for cookies
      });
      
      // Clear client-side storage (for non-HttpOnly tokens if any)
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to login
      navigate('/login');
      
      // Force full page reload to ensure all cookies are cleared
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback: still clear client storage and redirect
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    }
  };

  return (
    <nav className="sidebar d-flex flex-column justify-content-between">
      <div>
        <div className="sidebar-header text-center py-4">
          <h3 className="text-white fw-bold">🍕 Pizzería</h3>
        </div>
        <ul className="nav flex-column px-3">
          <li className="nav-item">
            <Link
              to="/home"
              className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/pedidos"
              className={`nav-link ${location.pathname === '/pedidos' ? 'active' : ''}`}
            >
              Pedidos
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/products"
              className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
            >
              Productos
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/categories"
              className={`nav-link ${location.pathname === '/categories' ? 'active' : ''}`}
            >
              Categories
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/carts"
              className={`nav-link ${location.pathname === '/carts' ? 'active' : ''}`}
            >
              Carts
            </Link>
          </li>
        </ul>
      </div>
      <div className="px-3 pb-4">
        <button 
          onClick={handleLogout}
          className="btn btn-danger w-100"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;