import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);

  // Imágenes de referencia para cada categoría
  const categoryImages = {
    'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'bebidas': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'postres': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'ensaladas': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'pastas': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'hamburguesas': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'default': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  };

  // Función para obtener la URL de la imagen
  const getImageUrl = (productData) => {
    // Si tenemos un ID de producto, usar el endpoint de imágenes
    if (productData.id) {
      return `http://localhost:8080/api/products/${productData.id}/image`;
    }
    
    // Intentar usar la ruta directa del archivo si existe
    if (productData.image) {
      return `http://localhost:8080/images/${productData.image}`;
    }
    
    // Si no tiene imagen, usar las imágenes de categoría como fallback
    const categoria = productData.categoria?.toLowerCase() || 'default';
    return categoryImages[categoria] || categoryImages.default;
  };

  // Función para normalizar datos del producto
  const normalizeProductData = (data) => {
    // Crear un nuevo objeto para no mutar el original
    const normalizedData = { ...data };
    
    // Mapear campos de la API a campos esperados por el componente
    if (data.productName && !normalizedData.nombre) {
      normalizedData.nombre = data.productName;
    }
    
    if (data.price && !normalizedData.precio) {
      normalizedData.precio = data.price;
    }
    
    if (data.description && !normalizedData.descripcion) {
      normalizedData.descripcion = data.description;
    }
    
    // Asignar URL de imagen
    normalizedData.imagen = getImageUrl(normalizedData);
    
    return normalizedData;
  };

  // Cargar el producto y productos relacionados desde API
  useEffect(() => {
    setLoading(true);
    
    // Obtener el producto - prueba primero con el endpoint 8000
    axios.get(`http://localhost:8000/api/products/${id}`)
      .then(res => {
        if (res.data) {
          const productoData = normalizeProductData(res.data);
          setProducto(productoData);
          
          // Cargar productos relacionados de la misma categoría
          if (productoData.categoria) {
            axios.get(`http://localhost:8000/api/products/category/${productoData.categoria}`)
              .then(relRes => {
                // Filtrar para no incluir el producto actual
                const relacionados = relRes.data
                  .filter(p => p.id !== productoData.id)
                  .slice(0, 4) // Mostrar máximo 4 productos relacionados
                  .map(p => normalizeProductData(p));
                
                setProductosRelacionados(relacionados);
              })
              .catch(err => {
                console.error("Error al cargar productos relacionados:", err);
                setProductosRelacionados([]);
              })
              .finally(() => setLoading(false));
          } else {
            setLoading(false);
          }
        } else {
          // Intentar con el endpoint 8080 si 8000 no devuelve datos
          fallbackToOtherEndpoint();
        }
      })
      .catch(err => {
        console.error("Error al cargar el producto desde 8000:", err);
        fallbackToOtherEndpoint();
      });
      
    // Función de respaldo para intentar con el otro puerto
    const fallbackToOtherEndpoint = () => {
      axios.get(`http://localhost:8080/api/products/${id}`)
        .then(res => {
          if (res.data) {
            const productoData = normalizeProductData(res.data);
            setProducto(productoData);
            setLoading(false);
          } else {
            setDefaultProduct(); // Cambiado de useDefaultProduct a setDefaultProduct
          }
        })
        .catch(err => {
          console.error("Error al cargar el producto desde 8080:", err);
          setDefaultProduct(); // Cambiado de useDefaultProduct a setDefaultProduct
        });
    };
    
    // Función para usar un producto por defecto
    const setDefaultProduct = () => {
      const categoria = 'pizza';
      const dummyProducto = normalizeProductData({
        id,
        nombre: 'Pizza Suprema',
        precio: 139.99,
        categoria: categoria,
        descripcion: 'Una deliciosa pizza con todos los ingredientes: pepperoni, jamón, pimientos, champiñones y más.',
        imagen: categoryImages[categoria],
      });
      
      setProducto(dummyProducto);
      setLoading(false);
    };
  }, [id]);

  // Spinner mientras carga
  if (loading) {
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
    <div className="container py-5">
      {/* Detalles del producto */}
      <div className="row justify-content-center align-items-center mb-5">
        <div className="col-md-6 mb-4">
          <img
 three            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded shadow-lg border border-light"
            style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
            onError={(e) => {
              console.log("Error loading image:", producto.imagen);
              e.target.src = categoryImages.default;
            }}
          />
        </div>
        <div className="col-md-6">
          <div className="d-flex flex-column justify-content-between h-100">
            <div>
              <span className="badge bg-secondary mb-2">{producto.categoria}</span>
              <h1 className="mb-3 text-primary font-weight-bold">{producto.nombre}</h1>
              <h4 className="text-success mb-4">${producto.precio?.toFixed(2)}</h4>
              <p className="lead">{producto.descripcion || 'Sin descripción disponible.'}</p>
              
              {/* Detalles adicionales si están disponibles */}
              {producto.ingredientes && (
                <div className="mt-3">
                  <h5>Ingredientes:</h5>
                  <p>{producto.ingredientes}</p>
                </div>
              )}
              
              {producto.tamano && (
                <div className="mt-2">
                  <h5>Tamaño:</h5>
                  <p>{producto.tamano}</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <div className="d-flex flex-wrap">
                <div className="me-2 mb-2">
                  <input
                    type="number"
                    className="form-control"
                    defaultValue="1"
                    min="1"
                    max="10"
                    style={{ width: '70px' }}
                  />
                </div>
                <button className="btn btn-primary btn-lg flex-grow-1">
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {productosRelacionados.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-4 text-center">Productos similares</h3>
          <div className="row">
            {productosRelacionados.map(prod => (
              <div className="col-md-3 col-sm-6 mb-4" key={prod.id}>
                <div className="card h-100 shadow-sm hover-shadow">
                  <img 
                    src={prod.imagen} 
                    alt={prod.nombre} 
                    className="card-img-top"
                    style={{ height: '180px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = categoryImages.default;
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{prod.nombre}</h5>
                    <p className="card-text text-success">${prod.precio?.toFixed(2)}</p>
                    <a 
                      href={`/productos/${prod.id}`} 
                      className="btn btn-outline-primary mt-auto"
                    >
                      Ver detalles
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;