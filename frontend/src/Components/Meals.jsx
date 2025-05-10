import React, { useState, useEffect } from "react";
import useHttp from "../hooks/useHttp.jsx";
import MealItem from "./MealItem.jsx";
import ErrorPage from "./ErrorPage.jsx";
import { API_BASE_URL } from "./ServerRequests.jsx";

const requestConfig = {};

export default function Meals({ isAdmin, category, searchQuery, sortOption }) {
  const { response: loadProducts, isLoading, error } = useHttp(
    `${API_BASE_URL}/products/get?category=${category.toUpperCase()}`,
    requestConfig,
    []
  );

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (!loadProducts) return;

    let products = [...loadProducts];

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.description.toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (sortOption) {
      if (sortOption === "A-Z") products.sort((a, b) => a.name.localeCompare(b.name));
      else if (sortOption === "Z-A") products.sort((a, b) => b.name.localeCompare(a.name));
      else if (sortOption === "price: low to high") products.sort((a, b) => a.price - b.price);
      else if (sortOption === "price: high to low") products.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(products);
  }, [loadProducts, searchQuery, sortOption]);

  if (isLoading) {
    return <p className="center">Fetching {category} Products...</p>;
  }

  if (error) {
    return <ErrorPage title="Failed to fetch meals" message={error.message} />;
  }

  return (
    <ul id="meals">
      {(searchQuery || sortOption ? filteredProducts : loadProducts).map((product) => (
        <MealItem
          key={product.id}
          product={product}
          isAdmin={isAdmin}
          onEdit={() => {}} // Edit moved to header or elsewhere
        />
      ))}
    </ul>
  );
}
