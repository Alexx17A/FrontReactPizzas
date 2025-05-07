// src/pages/Orders.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../assets/css/pedidos.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    axios.get('api/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error('Error al traer Pedidos:', err));
  }, []);

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="main-content p-4">
        <h1 className="text-center mb-4" data-aos="fade-up">Pedidos Recibidos</h1>

        <div className="table-responsive" data-aos="fade-up">
          <table className="table table-hover table-bordered shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.name}</td>
                    <td>{order.phone}</td>
                    <td>{order.address}</td>
                    <td>
                      <span className={`badge bg-${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.created_at}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">No hay pedidos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Función para asignar color al estado
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pendiente': return 'warning';
    case 'en camino': return 'primary';
    case 'entregado': return 'success';
    case 'cancelado': return 'danger';
    default: return 'secondary';
  }
};

export default Orders;
