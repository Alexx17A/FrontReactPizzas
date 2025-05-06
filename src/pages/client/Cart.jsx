import React from "react";
import "../../assets/css/cart.css";

const Cart = ({
  isOpen,
  toggleCart,
  handleOutsideClick,
  cartItems,
  handleRemove,
  handleDecrease,
  handleAdd,
  totalPrice,
}) => {
  const safeCartItems = cartItems || [];  // 👈 aseguramos array siempre

  return (
    <div
      className={`cart-overlay ${isOpen ? "open" : ""}`}
      onClick={handleOutsideClick}
    >
      <div className="cart">
        <button className="close-btn" onClick={toggleCart}>
          ×
        </button>
        <h2>Tu Carrito</h2>
        {safeCartItems.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <ul>
            {safeCartItems.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <div>
                  <button onClick={() => handleDecrease(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleAdd(item)}>+</button>
                  <button onClick={() => handleRemove(item.id)}>Eliminar</button>
                </div>
                <p>${item.price * item.quantity}</p>
              </li>
            ))}
          </ul>
        )}
        <div className="total">
          <strong>Total:</strong> ${totalPrice}
        </div>
      </div>
    </div>
  );
};

export default Cart;
