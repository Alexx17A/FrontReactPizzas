import React, { useState, useEffect } from 'react';
import { Table, Spinner, Form } from 'react-bootstrap';
import addressService from '../../services/addressService';
import ModalNotification from '../../components/ModalNotification';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressService.getAllAddresses();
      setAddresses(response);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setNotificationMessage('Error al cargar los domicilios');
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const filteredAddresses = addresses.filter(address => 
    address.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.street?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <h2>Domicilios</h2>
        <Form.Control
          type="text"
          placeholder="Buscar por usuario, calle o ciudad..."
          style={{ width: '300px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Calle</th>
              <th>Ciudad</th>
              <th>Código Postal</th>
              <th>País</th>
            </tr>
          </thead>
          <tbody>
            {filteredAddresses.map((address) => (
              <tr key={address.addressId}>
                <td>{address.addressId}</td>
                <td>{address.user?.username}</td>
                <td>{address.user?.email}</td>
                <td>{address.street}</td>
                <td>{address.city}</td>
                <td>{address.postalCode}</td>
                <td>{address.country}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ModalNotification
        show={showNotification}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
      />
    </>
  );
};

export default Addresses;