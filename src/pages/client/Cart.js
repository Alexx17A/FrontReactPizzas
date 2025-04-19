import React from "react";

const Cart = () => {
    return (
        <div className="modal fade" id="cartModal" tabIndex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold" id="cartModalLabel">Tu Carrito</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div className="modal-body">
                        {/* Aquí van los items del carrito dinámicamente */}
                        <p className="text-muted">Tu carrito está vacío.</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" data-bs-dismiss="modal">Seguir comprando</button>
                        <button className="btn btn-success">Proceder al pago</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
