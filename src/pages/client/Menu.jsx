import React from 'react';
import MenuItemCard from './MenuItemCard';
import CartContainer from './Cart.js'; // 

const MenuUI = ({
  username,
  category,
  searchTerm,
  products,
  totalPages,
  page,
  handleCategoryChange,
  handleSearchChange,
  setPage,
  onAddToCart,
  isLoading
}) => {

  const handleCartClick = () => {
    window.dispatchEvent(new CustomEvent("toggleCart"));
  };

  return (
    <div className="container py-4">
      {/* Encabezado con botón del carrito */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Menú</h2>
        <button 
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={handleCartClick}
        >
          🛒 Carrito
        </button>
      </div>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6">
          <select 
            className="form-select"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="all">Todos los productos</option>
            <option value="pizza">Pizzas</option>
            <option value="hotdog">Hot Dogs</option>
            <option value="hamburguesa">Hamburguesas</option>
            <option value="papas">Papas</option>
            <option value="bebidas">Bebidas</option>
            <option value="tacos">Tacos</option>
          </select>
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Productos */}
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando productos...</p>
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {products.map(product => (
              <div className="col" key={product.productId}>
                <MenuItemCard 
                  product={product} 
                  onAddToCart={onAddToCart}
                />
              </div>
            ))}
          </div>

          {products.length === 0 && !isLoading && (
            <div className="text-center py-5">
              <p>No se encontraron productos</p>
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li 
                    key={i} 
                    className={`page-item ${page === i ? 'active' : ''}`}
                  >
                    <button 
                      className="page-link" 
                      onClick={() => setPage(i)}
                    > 
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      )}

      {/* Carrito modal */}
      <CartContainer />
    </div>
  );
};

export default MenuUI;
