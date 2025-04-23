// src/pages/Products.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../assets/css/product.css';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error al traer los productos:', err));
  }, []);

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="main-content p-4">
        <h1 className="text-center mb-4" data-aos="fade-up">Productos Disponibles</h1>

        <div className="table-responsive" data-aos="fade-up">
          <table className="table table-striped table-bordered shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Tipo</th>
                <th>Fecha de Registro</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.nombre}</td>
                    <td>${parseFloat(product.precio).toFixed(2)}</td>
                    <td>{product.tipo}</td>
                    <td>{product.created_at}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">No hay productos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
