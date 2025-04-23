import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Cart from "./Cart";
import MenuItemCard from "./MenuItemCard";
import "../../assets/css/Menu.css"; // Importa el nuevo CSS

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
      
      <div className="menu-container">
        <div className="container">
          {/* Filtro de categorías */}
          <div className="category-filter-container">
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center">
              <span className="filter-label">Filtrar por categoría:</span>
              <select
                className="category-select"
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
          
          {/* Título del menú */}
          <div className="menu-header">
            <h1 className="menu-title">Nuestro Menú</h1>
          </div>
          
          {/* Grid de productos */}
          <div className="menu-grid">
            {filteredProducts.map((product) => (
              <MenuItemCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <Cart />
    </>
  );
};

export default Menu;