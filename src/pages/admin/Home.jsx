// src/pages/admin/Home.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../assets/css/home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 200,
    });

    const fetchData = async () => {
      try {
        const productsRes = await api.get(`/public/products?pageNumber=${currentPage}&pageSize=15`);
        
        // Handle products data
        const productsData = productsRes.data.content || productsRes.data || [];
        
        // Filter products with quantity
        const filteredProducts = productsData.filter(p => {
          const quantity = p.cantidad ?? p.quantity;
          return quantity != null && quantity > 0;
        });

        setProducts(filteredProducts);
        setTotalPages(productsRes.data.totalPages || 1);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Helper function to get product property safely
  const getProductProp = (product, propNames) => {
    for (const prop of propNames) {
      if (product[prop] !== undefined) return product[prop];
    }
    return '';
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-center mb-5" data-aos="fade-up">Dashboard de Pizzería</h1>

      <div className="row">
        {/* Aquí puedes agregar más cards de estadísticas en el futuro */}
        
        {/* Products Card */}
        <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-left">
          <div className="card card-shadow">
            <div className="card-header bg-warning text-white">
              <h4>Productos Disponibles</h4>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map(product => (
                        <tr key={product.productId}>
                          <td>{getProductProp(product, ['nombre', 'productName', 'name'])}</td>
                          <td>${parseFloat(getProductProp(product, ['precio', 'price'])).toFixed(2)}</td>
                          <td>{getProductProp(product, ['cantidad', 'quantity'])}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-4">
                          En esta página no hay productos con stock disponible
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center p-3 border-top">
                <button 
                  className="btn btn-sm btn-outline-secondary" 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  &laquo; Anterior
                </button>
                <span className="text-muted">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <button 
                  className="btn btn-sm btn-outline-secondary" 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  Siguiente &raquo;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;