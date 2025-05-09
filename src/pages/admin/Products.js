import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import Sidebar from '../../components/Navbar';
import EditProductModal from '../../components/modals/EditProductModal';
import AddProductModal from '../../components/modals/AddProductModal';
import FeedbackModal from '../../components/modals/FeedbackModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../assets/css/product.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });

  const [newProduct, setNewProduct] = useState({
    productName: '',
    description: '',
    quantity: 0,
    price: 0,
    discount: 0,
    categoryId: ''
  });

  const showFeedback = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => {
      setFeedback({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/public/categories');
      setCategories(response.data.content || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setProducts([]);
      setFilteredProducts([]);
  
      let url = '';
      
      if (searchQuery.trim() !== '') {
        url = `/public/products/keyword/${encodeURIComponent(searchQuery.trim())}?page=${page}`;
      } else if (selectedCategory) {
        url = `/public/categories/${selectedCategory}/products?pageNumber=${page}`;
      } else {
        url = `/public/products?pageNumber=${page}`;
      }
  
      const response = await api.get(url);
      
      const fetchedProducts = response.data.content || [];
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
      
      if (error.response) {
        if (error.response.status === 302) {
          setError('Authentication required. Please check if you need to login.');
          console.error('Redirect error:', error.response.data);
        } else {
          setError(`Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
          console.error('Error details:', error.response.data);
        }
      } else {
        setError('Failed to connect to server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedCategory]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (product) => {
    setSelectedProduct({
      ...product,
      categoryId: product.category?.categoryId || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await api.delete(`/admin/products/${productId}`);
        fetchProducts();
        showFeedback('Producto eliminado correctamente.');
      } catch (err) {
        showFeedback('Error al eliminar producto.', 'error');
      }
    }
  };

  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setSelectedProduct(prev => ({ ...prev, [name]: value }));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const submitEdit = async () => {
    try {
      await api.put(`/admin/products/${selectedProduct.productId}`, {
        ...selectedProduct,
        category: { categoryId: selectedProduct.categoryId }
      });
      setShowEditModal(false);
      setSelectedProduct(null);
      fetchProducts();
      showFeedback('Producto actualizado correctamente.');
    } catch (err) {
      showFeedback('Error al actualizar producto.', 'error');
    }
  };

  const submitAdd = async () => {
    try {
      await api.post(`/admin/categories/${newProduct.categoryId}/product`, {
        productName: newProduct.productName,
        description: newProduct.description,
        quantity: newProduct.quantity,
        price: newProduct.price,
        discount: newProduct.discount
      });
      setShowAddModal(false);
      setNewProduct({
        productName: '',
        description: '',
        quantity: 0,
        price: 0,
        discount: 0,
        categoryId: ''
      });
      fetchProducts();
      showFeedback('Producto agregado correctamente.');
    } catch (err) {
      showFeedback('Error al agregar producto.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="d-flex">
        <Sidebar />
        <div className="main-content p-4">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex">
        <Sidebar />
        <div className="main-content p-4">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content p-4">
        <h1 className="text-center mb-4" data-aos="fade-up">Productos Disponibles</h1>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}             
            />
          </div>
          <div className="ms-3">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSearchTerm('');
                setSearchQuery('');
                setPage(0);
              }}
            >
              <option value="">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn btn-success mb-3" onClick={() => setShowAddModal(true)}>
          Agregar Producto
        </button>

        <div className="table-responsive" data-aos="fade-up">
          <table className="table table-striped table-bordered shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Descuento</th>
                <th>Precio especial</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <tr key={product.productId}>
                    <td>{product.productId}</td>
                    <td>{product.productName}</td>
                    <td>{product.description}</td>
                    <td>{product.quantity}</td>
                    <td>${parseFloat(product.price).toFixed(2)}</td>
                    <td>{product.discount}%</td>
                    <td>${parseFloat(product.specialPrice).toFixed(2)}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(product)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.productId)}>Eliminar</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8" className="text-center text-muted">
                  {searchTerm 
                    ? "No se encontraron productos." 
                    : selectedCategory 
                      ? "No hay productos en esta categoría." 
                      : "No hay productos registrados."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPage(prev => Math.max(prev - 1, 0))}>Anterior</button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${i === page ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPage(i)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}>Siguiente</button>
              </li>
            </ul>
          </nav>
        </div>

        <EditProductModal
          show={showEditModal}
          product={selectedProduct}
          categories={categories}
          onClose={() => setShowEditModal(false)}
          onChange={(e) => handleInputChange(e, true)}
          onSubmit={submitEdit}
        />

        <AddProductModal
          show={showAddModal}
          product={newProduct}
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onChange={(e) => handleInputChange(e)}
          onSubmit={submitAdd}
        />

        <FeedbackModal
          show={feedback.show}
          message={feedback.message}
          type={feedback.type}
          onClose={() => setFeedback({ show: false, message: '', type: 'success' })}
        />
      </div>
    </div>
  );
};

export default Products;