import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuUI from "./Menu.jsx";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [username, setUsername] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = (selectedCategory, pageNumber = 0) => {
    const token = localStorage.getItem("jwt_token");
    setUsername(localStorage.getItem("username") || "");
  
    if (!token) {
      console.error("No hay JWT en localStorage");
      return;
    }
  
    setIsLoading(true);
    setProducts([]);
  
    let url = "";
    if (selectedCategory === "all") {
      url = `http://localhost:8080/api/public/products?sortBy=price&sortOrder=desc&pageSize=20&pageNumber=${pageNumber}`;
    } else {
      const categoryIds = {
        pizza: 1,
        hotdog: 2,
        bebidas: 3,
        papas: 4,
        hamburguesa: 5,
        tacos: 6,
      };
  
      const categoryId = categoryIds[selectedCategory.toLowerCase()];
      if (!categoryId) {
        console.error("Categoría no válida:", selectedCategory);
        setIsLoading(false);
        return;
      }
      url = `http://localhost:8080/api/public/categories/${categoryId}/products?pageSize=20&pageNumber=${pageNumber}`;
    }
  
    axios.get(url, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setProducts(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    })
    .catch((err) => {
      console.error("No se pudo obtener el menú.", err);
      setProducts([]);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };
  
  const fetchProductsByKeyword = (keyword) => {
    const token = localStorage.getItem("jwt_token");

    if (!token) {
      console.error("No hay JWT en localStorage");
      return;
    }

    setIsLoading(true);

    if (!keyword.trim()) {
      fetchProducts(category, 0);
      return;
    }

    axios.get(
      `http://localhost:8080/api/public/products/keyword/${keyword.trim()}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      setProducts(res.data || []);
      setTotalPages(1);
    })
    .catch((err) => {
      console.error("Error al buscar productos por keyword.", err);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const handleAddToCart = async (productId, quantity) => {
    const token = localStorage.getItem("jwt_token");
    
    if (!token) {
      console.error("No hay JWT en localStorage");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/carts/products/${productId}/quantity/${quantity}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        console.log("Producto agregado al carrito");
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      fetchProducts(category, page);
    }
  }, [category, page]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setPage(0);
    setSearchTerm("");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      fetchProducts(category, 0);
    } else {
      fetchProductsByKeyword(value);
    }
  };

  return (
    <MenuUI
      username={username}
      category={category}
      searchTerm={searchTerm}
      products={products}
      totalPages={totalPages}
      page={page}
      handleCategoryChange={handleCategoryChange}
      handleSearchChange={handleSearchChange}
      setPage={setPage}
      onAddToCart={handleAddToCart}
      isLoading={isLoading}
    />
  );
};

export default Menu;