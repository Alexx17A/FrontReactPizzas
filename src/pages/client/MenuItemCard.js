import React from "react";
import "../../assets/css/MenuItemCard.css";

const MenuItemCard = ({ product }) => {
    // Función para obtener emoji según categoría
    const getCategoryEmoji = (category) => {
        switch(category) {
            case 'pizza': return '🍕';
            case 'hotdog': return '🌭';
            case 'hamburguesa': return '🍔';
            case 'papas': return '🍟';
            case 'bebidas': return '🥤';
            case 'tacos': return '🌮';
            default: return '🍽';
        }
    };

    return (
        <div className="card h-100 shadow-sm border-0 rounded-4 menu-item-card">
            {/* Imagen del producto (puedes reemplazar con una imagen real) */}
            <div className="card-img-top">
                {product.nombre.charAt(0)}
            </div>
            
            <div className="card-body d-flex flex-column justify-content-between">
                <div>
                    <h5 className="card-title text-primary fw-bold">{product.nombre}</h5>
                    <p className="text-muted text-capitalize mb-2">
                        {getCategoryEmoji(product.tipo)} {product.tipo}
                    </p>
                </div>
                <div>
                    <p className="fw-bold text-success fs-5 mb-3">${product.precio}</p>
                    <button className="btn btn-warning w-100 fw-bold">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;