import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Cart from "./Cart";
import MenuItemCard from "./MenuItemCard";
import "../../assets/css/Menu.css";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [username, setUsername] = useState("");

  const mapProductToCategory = (p) => {
    const name = p.productName.toLowerCase();
    if (name.includes("pizza")) return "pizza";
    if (name.includes("hot dog")) return "hotdog";
    if (name.includes("hamburguesa")) return "hamburguesa";
    if (name.includes("papas")) return "papas";
    if (name.includes("bebidas")||name.includes("refresco")) return "bebidas";
    if (name.includes("taco")) return "tacos";
    return "otros";
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    setUsername(localStorage.getItem("username") || "");
    if (!token) {
      console.error("No hay JWT en localStorage");
      return;
    }
  
    axios.get(
      "http://localhost:8080/api/public/products?sortBy=price&sortOrder=desc&pageSize=20",
      {
        headers: {
          Authorization: `Bearer ${token}`   // <— aquí es donde tiene que ir
        }
      }
    )
    .then(res => {
      setProducts(res.data.content);
      setFilteredProducts(res.data.content);
    })
    .catch(err => {
      console.error("No se pudo obtener el menú.", err);
    });
  }, []);
  

  useEffect(() => {
    if (category === "all") setFilteredProducts(products);
    else setFilteredProducts(products.filter(p => mapProductToCategory(p) === category));
  }, [category, products]);

  return (
    <>
      <Navbar />
      <div className="menu-container">
        <div className="container">
          {username && <div className="user-greeting"><h4>Bienvenido, {username} 👋</h4></div>}
          {/* filtro */}
          <div className="category-filter-container">
            <select
              className="category-select"
              onChange={e => setCategory(e.target.value)}
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
          {/* grid */}
          <div className="menu-grid">
            {filteredProducts.length > 0
              ? filteredProducts.map(p => (
                  <MenuItemCard
                    key={p.productId}
                    product={{ ...p, tipo: mapProductToCategory(p) }}
                  />
                ))
              : <p>No hay productos disponibles.</p>}
          </div>
        </div>
      </div>
      <Cart />
    </>
  );
};

export default Menu;
