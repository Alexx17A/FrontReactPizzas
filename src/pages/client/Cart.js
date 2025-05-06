import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/css/cart.css";
import Cart from "./Cart.jsx";

const CartContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the current user's cart
  const fetchCart = async () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/carts/users/cart",
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data;
      setCartId(data.cartId);
      setCartItems(data.products || []);
      setTotalPrice(data.totalPrice ?? 0);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
      setTotalPrice(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchCart();
  }, [isOpen]);

  // Listen for global cart toggle and updates
  useEffect(() => {
    const handleToggleCart = () => setIsOpen(prev => !prev);
    const handleCartUpdate = () => {
      if (isOpen) fetchCart();
    };

    window.addEventListener("toggleCart", handleToggleCart);
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("toggleCart", handleToggleCart);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [isOpen]);

  const toggleCart = () => setIsOpen(prev => !prev);
  const handleOutsideClick = e =>
    e.target.classList.contains("cart-overlay") && toggleCart();

  // Generic method to call cart mutate endpoints and refresh state
  const mutateCart = async (method, url) => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return;
    
    setIsLoading(true);
    try {
      await axios({
        method,
        url,
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      // After mutation, re-fetch the cart so UI updates
      await fetchCart();
    } catch (err) {
      console.error("Error mutating cart", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove entire product from cart
  const handleRemove = async productId => {
    if (!cartId || isLoading) return;
    console.log(`Removing product ${productId} from cart ${cartId}`);
    await mutateCart(
      "delete",
      `http://localhost:8080/api/carts/${cartId}/product/${productId}`
    );
  };

  // Decrease quantity by 1
  const handleDecrease = async productId => {
    if (!cartId || isLoading) return;
    console.log(`Decreasing quantity for product ${productId} in cart ${cartId}`);
    await mutateCart(
      "put",
      `http://localhost:8080/api/carts/${cartId}/product/${productId}/quantity/delete`
    );
  };

  // Increase quantity by 1
  const handleAdd = async productId => {
    if (!cartId || isLoading) return;
    console.log(`Adding quantity for product ${productId} in cart ${cartId}`);
    await mutateCart(
      "post",
      `http://localhost:8080/api/carts/${cartId}/product/${productId}/quantity/1`
    );
  };

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