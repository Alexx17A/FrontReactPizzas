import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Sidebar from '../components/Navbar';
import '../assets/css/home.css';

const Home = () => {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 200,
    });

    axios.get('/api/dashboard/stats')
      .then(response => setStats(response.data))
      .catch(error => console.error('Error loading stats:', error));

    axios.get('/api/orders')
      .then(response => setOrders(response.data))
      .catch(error => console.error('Error loading orders:', error));

    axios.get('/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error loading products:', error));
  }, []);

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="main-content p-4">
        <h1 className="text-center mb-5" data-aos="fade-up">Dashboard de Pizzería</h1>

        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-right">
            <div className="card card-shadow">
              <div className="card-header bg-primary text-white">
                <h4>Estadísticas Generales</h4>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  <li className="list-group-item">Pedidos Totales: {stats.totalOrders}</li>
                  <li className="list-group-item">Productos Vendidos: {stats.totalProducts}</li>
                  <li className="list-group-item">Clientes: {stats.totalClients}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
            <div className="card card-shadow">
              <div className="card-header bg-success text-white">
                <h4>Pedidos Recientes</h4>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  {orders.slice(0, 5).map(order => (
                    <li key={order.id} className="list-group-item">
                      <strong>{order.name}</strong> - {order.status}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-left">
            <div className="card card-shadow">
              <div className="card-header bg-warning text-white">
                <h4>Productos Disponibles</h4>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  {products.slice(0, 5).map(product => (
                    <li key={product.id} className="list-group-item">
                      {product.nombre} - ${product.precio}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
