import React, { useEffect, useState } from "react";
import api from "../../services/api"; 
import MenuUI from "./Menu.jsx";
import { useAuth } from "../../context/AuthContext"; 

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Si quieres mostrar el username:
  const { user } = useAuth();
  const username = user?.username || "";

  const fetchProducts = (selectedCategory, pageNumber = 0) => {
    setIsLoading(true);
    setProducts([]);

    let url = "";
    if (selectedCategory === "all") {
      url = `/public/products?sortBy=price&sortOrder=desc&pageSize=20&pageNumber=${pageNumber}`;
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
      url = `/public/categories/${categoryId}/products?pageSize=20&pageNumber=${pageNumber}`;
    }

    api.get(url)
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
    setIsLoading(true);

    if (!keyword.trim()) {
      fetchProducts(category, 0);
      return;
    }

    api.get(`/public/products/keyword/${keyword.trim()}`)
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
    try {
      const response = await api.post(
        `/carts/products/${productId}/quantity/${quantity}`,
        {}
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
    // eslint-disable-next-line
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