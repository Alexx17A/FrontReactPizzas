import React from "react";
import "../../assets/css/MenuItemCard.css"; // lo puedes crear con estilos extra si gustas

const MenuItemCard = ({ product }) => {
    return (
        <div className="card h-100 shadow-sm border-0 rounded-4 menu-item-card">
            <div className="card-body d-flex flex-column justify-content-between">
                <div>
                    <h5 className="card-title text-primary fw-bold">{product.nombre}</h5>
                    <p className="text-muted text-capitalize mb-2">🍽 Categoría: {product.tipo}</p>
                </div>
                <div>
                    <p className="fw-bold text-success fs-5 mb-3">💰 ${product.precio}</p>
                    <button className="btn btn-warning w-100 fw-bold">Agregar al carrito 🛒</button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;
