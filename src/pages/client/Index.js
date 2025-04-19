import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/StoreHome.css';
import { Link } from 'react-router-dom';

const StoreHome = () => {
  const [products, setProducts] = useState([]);

  const dummyData = [
    {
      id: 1,
      nombre: 'Pizza Pepperoni',
      precio: 150,
      imagen: 'https://via.placeholder.com/300x200.png?text=Pizza+Pepperoni'
    },
    {
      id: 2,
      nombre: 'Pizza Hawaiana',
      precio: 160,
      imagen: 'https://via.placeholder.com/300x200.png?text=Pizza+Hawaiana'
    },
    {
      id: 3,
      nombre: 'Pizza Mexicana',
      precio: 170,
      imagen: 'https://via.placeholder.com/300x200.png?text=Pizza+Mexicana'
    }
  ];

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    axios.get('http://localhost:8000/api/products')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(dummyData);
        }
      })
      .catch(() => {
        setProducts(dummyData);
      });
  }, []);

  return (
    <div className="store-container bg-light">
      {/* Hero section con fondo y texto centrado */}
      <header className="hero text-white text-center py-5" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1600891964599-f61ba0e24092)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div className="bg-dark bg-opacity-50 py-5">
          <h1 className="display-4" data-aos="fade-down">¡Bienvenido a La Pizzería!</h1>
          <p className="lead" data-aos="fade-up" data-aos-delay="200">
            Del horno directo a tu corazón 🍕❤️
          </p>
        </div>
      </header>

      {/* Menú */}
      <section className="container my-5">
        <h2 className="text-center mb-5" data-aos="fade-right">Nuestro Menú</h2>
        <div className="row">
          {products.map(product => (
            <div className="col-md-4 mb-4" key={product.id} data-aos="zoom-in">
              <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                <img
                  src={product.imagen}
                  className="card-img-top"
                  alt={product.nombre}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{product.nombre}</h5>
                  <p className="card-text fs-5 fw-bold text-danger">${product.precio}</p>
                  <Link
                    to={`/producto/${product.id}`}
                    className="btn btn-danger rounded-pill px-4 w-100"
                  >
                    Ver más
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StoreHome;
