import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Sidebar from '../../components/Navbar';
import '../../assets/css/home.css';

const Home = () => {
  // const [stats, setStats] = useState({});
  // const [orders, setOrders] = useState([]);
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
        /**
         * const [ordersRes, productsRes] = await Promise.all([
          api.get('/admin/orders'),
          api.get(`/public/products?pageNumber=${currentPage}&pageSize=15`)
        ]);
         */
        const [, productsRes] = await Promise.all([
          api.get('/admin/orders'),
          api.get(`/public/products?pageNumber=${currentPage}&pageSize=15`)
        ]);

        // // Sort orders by date (newest first)
        // const sortedOrders = [...ordersRes.data].sort((a, b) => 
        //   new Date(b.created_at) - new Date(a.created_at)
        // );
        // setOrders(sortedOrders);
        
        // Handle products data
        const productsData = productsRes.data.content || productsRes.data || [];
        
        // Filter products with quantity
        const filteredProducts = productsData.filter(p => {
          const quantity = p.cantidad ?? p.quantity;
          return quantity != null && quantity > 0;
        });

        setProducts(filteredProducts);
        setTotalPages(productsRes.data.totalPages || 1);
        
        // Set stats - only total orders
        // setStats({
        //   totalOrders: sortedOrders.length
        // });
        
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
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="main-content p-4">
        <h1 className="text-center mb-5" data-aos="fade-up">Dashboard de Pizzería</h1>

        <div className="row">
          {/* Stats Card - unchanged */}

          {/* Recent Orders Card - unchanged */}

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
    </div>
  );
};

export default Home;