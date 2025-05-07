import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/StoreHome.css';
import { Link } from 'react-router-dom';

const StoreHome = () => {
  const [products, setProducts] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const dummyData = [
    {
      id: 1,
      nombre: 'Pizza Pepperoni',
      precio: 150,
      imagen: 'https://www.lapizzaloca.com/wp-content/uploads/2024/02/pepperoni-pizza.png'
    },
    {
      id: 2,
      nombre: 'Pizza Hawaiana',
      precio: 160,
      imagen: 'https://www.lapizzaloca.com/wp-content/uploads/2024/02/Large-hawaiian.png'
    },
    {
      id: 3,
      nombre: 'Pizza Mexicana',
      precio: 170,
      imagen: 'https://www.lapizzaloca.com/wp-content/uploads/2023/10/la-mexicana.png'
    },
    {
      id: 4,
      nombre: 'Pizza Supreme',
      precio: 150,
      imagen: 'https://www.lapizzaloca.com/wp-content/uploads/2023/10/Supreme.png'
    },
    {
      id: 5,
      nombre: 'Pizza Vegetariana',
      precio: 160,
      imagen: 'https://www.lapizzaloca.com/wp-content/uploads/2023/10/vegetarian.png'
    },
    {
      id: 6,
      nombre: 'Pizza de queso',
      precio: 170,
      imagen: 'https://www.lapizzaloca.com/wp-content/uploads/2024/02/large-cheese-only.png'
    }
  ];

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // 👇 Verificamos si está logueado
    const token = localStorage.getItem('jwt_token');
    const storedUsername = localStorage.getItem('username');

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }

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

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 👇 Handler para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    window.location.reload();  // 🔄 Refresca para aplicar los cambios
  };

  return (
    <div className="store-container bg-light">
      {/* Navbar integrado */}
      <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
        <div className="container">
          <Link className="navbar-brand" to="/" data-aos="fade-right">
            <span className="logo-text">Tazz</span>
            <span className="logo-pizza">Pizza</span>
            <span className="logo-icon">🍕</span>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item" data-aos="fade-down" data-aos-delay="100">
                <Link className="nav-link" to="/menu">
                  <span className="nav-icon">🍽️</span> Menú
                </Link>
              </li>
              <li className="nav-item" data-aos="fade-down" data-aos-delay="200">
                <Link className="nav-link" to="/about">
                  <span className="nav-icon">👨‍🍳</span> Sobre Nosotros
                </Link>
              </li>
            </ul>

            <div className="d-flex align-items-center" data-aos="fade-left">
              {isLoggedIn ? (
                <>
                  <span className="text-white me-3">👋 Hola, {username}</span>
                  <button onClick={handleLogout} className="btn btn-warning">
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/Registro" className="btn btn-outline-light me-2 register-btn">
                    Registrarse
                  </Link>
                  <Link to="/login" className="btn btn-danger login-btn">
                    Iniciar Sesión
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero section con fondo y texto centrado */}
      <header className="hero text-white text-center py-5" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1600891964599-f61ba0e24092)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        marginTop: '56px' // Para compensar el navbar fijo
      }}>
        <div className="bg-dark bg-opacity-50 py-5">
          <h1 className="display-4" data-aos="fade-down">¡Bienvenido a TazzPizza!</h1>
          <p className="lead" data-aos="fade-up" data-aos-delay="200">
            Del horno directo a tu corazón  
            <br />
            Desde 1995
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
                    to={`/menu`}
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
