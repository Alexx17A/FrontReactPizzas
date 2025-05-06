import React from 'react';
import { Container } from 'react-bootstrap';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <Container fluid className="p-4">
        <h1 className="mb-4">Taz Pizza - Admin Dashboard</h1>
        {children}
      </Container>
    </div>
  );
};

export default AdminLayout;