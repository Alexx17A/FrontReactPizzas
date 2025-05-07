// src/components/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <nav className="sidebar">
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
            to="/clients"
            className={`nav-link ${location.pathname === '/clients' ? 'active' : ''}`}
          >
            Clientes
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
