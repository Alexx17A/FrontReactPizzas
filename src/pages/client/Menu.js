import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Cart from "./Cart";
import MenuItemCard from "./MenuItemCard";
import "../../assets/css/Menu.css";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [username, setUsername] = useState("");
  const [page, setPage] = useState(0); // página actual
  const [totalPages, setTotalPages] = useState(0); // total de páginas
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = (selectedCategory, pageNumber = 0) => {
    const token = localStorage.getItem("jwt_token");
    setUsername(localStorage.getItem("username") || "");

    if (!token) {
      console.error("No hay JWT en localStorage");
      return;
    }

    let url = "";
    if (selectedCategory === "all") {
      url = `http://localhost:8080/api/public/products?sortBy=price&sortOrder=desc&pageSize=20&pageNumber=${pageNumber}`;
    } else {
      const categoryIds = {
        pizza: 1,
        hotdog: 2,
        hamburguesa: 3,
        papas: 4,
        bebidas: 5,
        tacos: 6,
      };

      const categoryId = categoryIds[selectedCategory];
      if (!categoryId) {
        console.error("Categoría no válida:", selectedCategory);
        return;
      }
      url = `http://localhost:8080/api/public/categories/${categoryId}/products?pageSize=20&pageNumber=${pageNumber}`;
    }

    axios
      .get(url, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Productos recibidos:", res.data.content);
        setProducts(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => {
        console.error("No se pudo obtener el menú.", err);
      });
  };

  const fetchProductsByKeyword = (keyword) => {
    const token = localStorage.getItem("jwt_token");

    if (!token) {
      console.error("No hay JWT en localStorage");
      return;
    }

    if (!keyword.trim()) {
      // Si el campo está vacío, recargar la categoría actual
      fetchProducts(category, 0);
      return;
    }

    axios
      .get(
        `http://localhost:8080/api/public/products/keyword/${keyword.trim()}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("Resultados de búsqueda:", res.data);
        setProducts(res.data || []);
        setTotalPages(1); // búsqueda simple, sin paginación por ahora
      })
      .catch((err) => {
        console.error("Error al buscar productos por keyword.", err);
      });
  };

  // Fetch inicial
  useEffect(() => {
    if (!searchTerm) {
      fetchProducts(category, page);
    }
  }, [category, page]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setPage(0); // Reinicia la paginación
    setSearchTerm(""); // Limpiamos la búsqueda cuando cambias categoría
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      fetchProducts(category, 0); // Si está vacío, volvemos a la categoría
    } else {
      fetchProductsByKeyword(value);
    }
  };

  return (
    <>
      <Navbar />
      <div className="menu-container">
        <div className="container">
          {username && (
            <div className="user-greeting">
              <h4>Bienvenido, {username} 👋</h4>
            </div>
          )}
          {/* filtro */}
          <div className="category-filter-container mb-3">
            <select
              className="category-select"
              onChange={handleCategoryChange}
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

          {/* search */}
          <div className="search-box mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* grid */}
          <div className="menu-grid">
            {products.length > 0 ? (
              products.map((p) => (
                <MenuItemCard key={p.productId} product={p} />
              ))
            ) : (
              <p>No hay productos disponibles.</p>
            )}
          </div>

          {/* paginación */}
          {searchTerm.trim() === "" && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`page-button ${index === page ? "active" : ""}`}
                  onClick={() => setPage(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Cart />
    </>
  );
};

export default Menu;
