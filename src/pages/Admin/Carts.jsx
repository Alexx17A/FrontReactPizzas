import React, { useState, useEffect } from 'react';
import { Table, Spinner, Form } from 'react-bootstrap';
import cartService from '../../services/cartService';
import ModalNotification from '../../components/ModalNotification';

const Carts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const fetchCarts = async () => {
    try {
      setLoading(true);
      const response = await cartService.getAllCarts();
      setCarts(response);
    } catch (error) {
      console.error('Error fetching carts:', error);
      setNotificationMessage('Error al cargar los carritos');
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  const filteredCarts = carts.filter(cart => 
    cart.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cart.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <h2>Carritos de Compras</h2>
        <Form.Control
          type="text"
          placeholder="Buscar por usuario..."
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
              <th>Productos</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredCarts.map((cart) => (
              <tr key={cart.cartId}>
                <td>{cart.cartId}</td>
                <td>{cart.user?.username}</td>
                <td>{cart.user?.email}</td>
                <td>
                  {cart.products?.map(item => (
                    <div key={item.product.productId}>
                      {item.product.name} (x{item.quantity})
                    </div>
                  ))}
                </td>
                <td>
                  ${cart.products?.reduce((total, item) => 
                    total + (item.product.price * item.quantity), 0).toFixed(2)}
                </td>
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

export default Carts;