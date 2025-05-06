import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/css/cart.css";
import Cart from "./Cart.jsx";

const CartContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCart = async () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return;
    try {
      const res = await axios.get(
        "http://localhost:8080/api/carts/users/cart",
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // tu API devuelve { cartId, totalPrice, products: [...] }
      setCartItems(res.data.products || []);
      setTotalPrice(res.data.totalPrice ?? 0);
    } catch (err) {
      console.error("No se pudo cargar el carrito", err);
    }
  };

  // Al abrir el modal, cargo el carrito
  useEffect(() => {
    if (isOpen) fetchCart();
  }, [isOpen]);

  // Escucho eventos para refrescar
  useEffect(() => {
    const onToggle = () => setIsOpen((o) => !o);
    const onUpdate = () => {
      if (isOpen) fetchCart();
    };
    window.addEventListener("toggleCart", onToggle);
    window.addEventListener("cartUpdated", onUpdate);
    return () => {
      window.removeEventListener("toggleCart", onToggle);
      window.removeEventListener("cartUpdated", onUpdate);
    };
  }, [isOpen]);

  const toggleCart = () => setIsOpen((o) => !o);
  const handleOutsideClick = (e) =>
    e.target.classList.contains("cart-overlay") && toggleCart();

  // Las acciones de +, - y eliminar lanzan un evento global para refrescar
  const mutateCart = async (method, url) => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return;
    try {
      await axios({
        method,
        url,
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (err) {
      console.error("Error mutando carrito", err);
    }
  };

  const handleRemove = (id) =>
    mutateCart(
      "delete",
      `http://localhost:8080/api/carts/products/${id}/quantity/delete`
    );
  const handleDecrease = (id) =>
    mutateCart("post", `http://localhost:8080/api/carts/products/${id}/quantity/dec`);
  const handleAdd = (item) =>
    mutateCart("post", `http://localhost:8080/api/carts/products/${item.productId}/quantity/1`);

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
