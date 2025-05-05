import React from 'react';
import { Link } from 'react-router-dom';

const MenuItemCard = ({ product }) => {
  const getCategoryImage = (category) => {
    const images = {
      pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      hotdog: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      hamburguesa: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      papas: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      bebidas: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      tacos: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    };
    return images[category] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
  };

  const imageUrl = product.image || getCategoryImage(product.tipo);
  const displayPrice = product.specialPrice ? (
    <>
      <span className="text-muted text-decoration-line-through">${product.price}</span>{' '}
      <span>${product.specialPrice}</span>
    </>
  ) : (
    <span>${product.price}</span>
  );

  return (
    <div className="menu-item-card">
      <img
        src={imageUrl}
        className="card-img-top"
        alt={product.productName}
      />
      <div className="card-body">
        <h5 className="card-title">{product.productName}</h5>
        <p className="card-text">{displayPrice}</p>
        <div className="d-flex justify-content-between gap-2">
          <button className="btn btn-outline-dark flex-grow-1">
            Agregar
          </button>
          <Link
            to={`/producto/${product.productId}`}
            className="btn btn-dark flex-grow-1"
          >
            Ver más
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
