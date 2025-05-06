import React, { useState, useEffect } from "react";
import "../../assets/css/cart.css";
import {
  getCart,
  addToCart,
  removeFromCart,
  decreaseQuantity,
} from "../../components/cartService";
import Cart from "./Cart.jsx";

const CartContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const cart = getCart();
      setCartItems(cart || []);  // 👈 aseguramos array
    }
  }, [isOpen]);

  useEffect(() => {
    const handleToggleCart = () => {
      setIsOpen((prev) => !prev);
    };

    const handleCartUpdate = () => {
      const cart = getCart();
      setCartItems(cart || []);  // 👈 aseguramos array
    };

    window.addEventListener("toggleCart", handleToggleCart);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("toggleCart", handleToggleCart);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const toggleCart = () => setIsOpen(!isOpen);

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("cart-overlay")) {
      toggleCart();
    }
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
    const cart = getCart();
    setCartItems(cart || []);  // 👈 aseguramos array
  };

  const handleDecrease = (productId) => {
    decreaseQuantity(productId);
    const cart = getCart();
    setCartItems(cart || []);  // 👈 aseguramos array
  };

  const handleAdd = (product) => {
    addToCart(product);
    const cart = getCart();
    setCartItems(cart || []);  // 👈 aseguramos array
  };

  const totalPrice = (cartItems || []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Cart
      isOpen={isOpen}
      toggleCart={toggleCart}
      handleOutsideClick={handleOutsideClick}
      cartItems={cartItems}
      handleRemove={handleRemove}
      handleDecrease={handleDecrease}
      handleAdd={handleAdd}
      totalPrice={totalPrice}
    />
  );
};

export default CartContainer;
