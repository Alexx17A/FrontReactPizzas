import React, { useEffect, useState } from 'react';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Sidebar from '../components/Navbar';
import '../assets/css/home.css';

const Home = () => {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 200,
    });

    const fetchData = async () => {
      try {
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          api.get('/api/dashboard/stats'),
          api.get('/api/admin/orders'),
          api.get('/api/public/products')
        ]);

        setStats(statsRes.data);
        
        // Sort orders by date (newest first) - fixed syntax
        const sortedOrders = [...ordersRes.data].sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setOrders(sortedOrders);
        
        setProducts(productsRes.data.content || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="main-content p-4">
        <h1 className="text-center mb-5" data-aos="fade-up">Dashboard de Pizzería</h1>

        <div className="row">
          {/* Stats Card */}
          <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-right">
            <div className="card card-shadow">
              <div className="card-header bg-primary text-white">
                <h4>Estadísticas Generales</h4>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  <li className="list-group-item">Pedidos Totales: {stats.totalOrders || 0}</li>
                  <li className="list-group-item">Productos Vendidos: {stats.totalProducts || 0}</li>
                  <li className="list-group-item">Clientes: {stats.totalClients || 0}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recent Orders Card */}
          <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
            <div className="card card-shadow">
              <div className="card-header bg-success text-white">
                <h4>Pedidos Recientes</h4>
              </div>
              <div className="card-body">
                {orders.length > 0 ? (
                  <ul className="list-group">
                    {orders.slice(0, 5).map(order => (
                      <li key={order.id} className="list-group-item">
                        <strong>{order.name}</strong> - {order.status}
                        <br />
                        <small>{new Date(order.created_at).toLocaleString()}</small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-muted">No hay pedidos recientes</div>
                )}
              </div>
            </div>
          </div>

          {/* Products Card */}
          <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-left">
            <div className="card card-shadow">
              <div className="card-header bg-warning text-white">
                <h4>Productos Disponibles</h4>
              </div>
              <div className="card-body">
                {products.length > 0 ? (
                  <ul className="list-group">
                    {products.slice(0, 5).map(product => (
                      <li key={product.id} className="list-group-item">
                        {product.nombre} - ${product.precio.toFixed(2)}
                        {product.cantidad && <span> (Stock: {product.cantidad})</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-muted">No hay nada aquí...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;