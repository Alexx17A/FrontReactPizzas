import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Nav className="flex-column bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
      <Nav.Item className="mb-4">
        <h4>Taz Pizza Admin</h4>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/admin/products" className="text-white">Productos</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/admin/categories" className="text-white">Categorías</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/admin/carts" className="text-white">Carritos</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/admin/addresses" className="text-white">Domicilios</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Sidebar;