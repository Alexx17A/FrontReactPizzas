import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  // Dummy por si la API no responde bien
  const dummy = {
    id,
    nombre: 'Pizza Suprema',
    precio: 139.99,
    descripcion: 'Una deliciosa pizza con todos los ingredientes: pepperoni, jamón, pimientos, champiñones y más.',
    imagen: 'https://via.placeholder.com/600x400.png?text=Pizza+Suprema',
  };

  // Cargar el producto desde API
  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${id}`)
      .then(res => {
        if (res.data && res.data.nombre) {
          setProducto(res.data);
        } else {
          setProducto(dummy);
        }
      })
      .catch(err => {
        console.error("Error al cargar el producto:", err);
        setProducto(dummy);
      });
  }, [id]);

  // Spinner mientras carga
  if (!producto) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '4rem', height: '4rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando producto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6 mb-4">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded shadow-lg border border-light"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-6">
          <div className="d-flex flex-column justify-content-between h-100">
            <div>
              <h1 className="mb-3 text-primary font-weight-bold">{producto.nombre}</h1>
              <h4 className="text-success mb-4">${producto.precio.toFixed(2)}</h4>
              <p className="lead">{producto.descripcion || 'Sin descripción disponible.'}</p>
            </div>
            <div>
              <button className="btn btn-primary btn-lg mt-3 w-100">Agregar al carrito</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
