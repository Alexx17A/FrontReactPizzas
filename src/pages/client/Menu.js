import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Cart from "./Cart";
import MenuItemCard from "./MenuItemCard";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    axios
      .get("/api/menu")
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch((err) => {
        console.error("No se pudo obtener el menú, usando datos de prueba.");
        const dummyData = [
          { id: 1, nombre: "Pizza Clásica", tipo: "pizza", precio: 120 },
          { id: 2, nombre: "Hot Dog XL", tipo: "hotdog", precio: 70 },
          { id: 3, nombre: "Hamburguesa BBQ", tipo: "hamburguesa", precio: 90 },
          { id: 4, nombre: "Papas a la Francesa", tipo: "papas", precio: 50 },
          { id: 5, nombre: "Refresco Grande", tipo: "bebidas", precio: 25 },
          { id: 6, nombre: "Tacos al Pastor", tipo: "tacos", precio: 85 },
        ];
        setProducts(dummyData);
        setFilteredProducts(dummyData);
      });
  }, []);

  useEffect(() => {
    if (category === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.tipo === category));
    }
  }, [category, products]);

  return (
    <>
      <Navbar />

      <div
        className="container my-4 position-sticky"
        style={{ top: 0, zIndex: 1000 }}
      >
        <div className="bg-light p-3 rounded shadow">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center justify-content-center">
                <label
                  htmlFor="categoryFilter"
                  className="me-3 fw-bold fs-5"
                  style={{ fontFamily: "'Fredoka One', cursive" }}
                >
                  Filtrar por categoría:
                </label>
                <select
                  id="categoryFilter"
                  className="form-select form-select-lg w-50"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
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
            </div>
          </div>
        </div>
      </div>

      <section className="container my-5">
        <h2
          className="text-center mb-4 fw-bold text-danger"
          style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2.5rem" }}
        >
          🍕 Nuestro Menú 🍟
        </h2>
        <div className="row g-4" id="menuItemsContainer">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-md-4">
              <MenuItemCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <Cart />
    </>
  );
};

export default Menu;
