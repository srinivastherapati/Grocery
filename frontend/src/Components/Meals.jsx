import React, { useState } from "react";
import useHttp from "../hooks/useHttp.jsx";
import ErrorPage from "./ErrorPage.jsx";
import MealItem from "./MealItem.jsx";
import AddMealModal from "./AddMealModal.jsx";
import { Button, TextField, Select, MenuItem, Box } from "@mui/material";
import { API_BASE_URL } from "./ServerRequests.jsx";
import AddNewCategory from "./AddNewCategory.jsx";

const requestConfig = {};

export default function Meals({ isAdmin, category }) {
  const {
    response: loadProducts,
    isLoading,
    error,
  } = useHttp(
    `${API_BASE_URL}/products/get?category=${category.toUpperCase()}`,
    requestConfig,
    []
  );

  const [isAdd, setIsAdd] = useState(false);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [currentProduct, setCurrentProduct] = useState("");
  const [currentCategory, setCurrentCategory] = useState("");

  const products = loadProducts || [];

  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();
    const matchedProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredProducts(matchedProducts);
  };

  const handleSort = (option) => {
    setSortOption(option);
    const sortedProducts = [
      ...(filteredProducts.length ? filteredProducts : products),
    ];

    if (option === "A-Z") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === "Z-A") {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (option === "price: low to high") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (option === "price: high to low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(sortedProducts);
  };

  const handleAddMealSuccess = () => {
    setIsAdd(false);
    setShowAddModal(false);
    setShowAddCategory(false);
    window.location.reload();
  };

  const displayedProducts =
    searchQuery || sortOption ? filteredProducts : products;

  if (isLoading) {
    return <p className="center">Fetching {category} Products....</p>;
  }
  if (error) {
    return <ErrorPage title="failed to fetch meals" message={error.message} />;
  }

  const handleEditMeal = (product) => {
    console.log(product);
    setCurrentProduct(product);
    setIsAdd(false);
    setShowAddModal(true); // Open modal for editing
  };

  const handleAddMeal = (product) => {
    setCurrentProduct({
      name: "",
      imageUrl: "",
      stock: 1,
      description: "",
      units:"",
      price: "",
      category: category,
    });
    setIsAdd(true);
    setShowAddModal(true);
  };
  const handleAddCategory = (product) => {
    setCurrentCategory({
      name: "",
      description:""
    });
    setIsAdd(true);
    setShowAddCategory(true);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        {/* Search Bar */}
        <TextField
          label="Search Meals"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{
            flex: 1, // Take available space
            maxWidth: "500px", // Ensure consistent width
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            color: "black",
            borderRadius: "10px",
            height: "40px", // Consistent height
            marginLeft: "72px",
          }}
          InputLabelProps={{
            style: { color: "black" },
          }}
          inputProps={{
            style: { color: "black" },
          }}
        />

        {/* Sort and Add Meal */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Select
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
            size="small"
            displayEmpty
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              color: "black",
              borderRadius: "10px",
              height: "40px", // Align height
              "& .MuiSelect-icon": { color: "black" },
              marginRight: isAdmin ? "0px" : "78px",
            }}
            renderValue={(selected) => selected || "Sort By"}
          >
            <MenuItem value="A-Z">A-Z</MenuItem>
            <MenuItem value="Z-A">Z-A</MenuItem>
            <MenuItem value="price: low to high">Price: Low to High</MenuItem>
            <MenuItem value="price: high to low">Price: High to Low</MenuItem>
          </Select>
          {isAdmin && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ffc404",
                color: "black",
                borderRadius: "10px",
                height: "40px", // Align height
                "&:hover": { backgroundColor: "#e6b800" },
                marginRight: "78px",
              }}
              onClick={() => {
                setCurrentProduct(null);
                handleAddMeal();
              }}
            >
              Add New Item
            </Button>
          ) }
           {isAdmin && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ffc404",
                color: "black",
                borderRadius: "10px",
                height: "40px", // Align height
                "&:hover": { backgroundColor: "#e6b800" },
                marginRight: "78px",
              }}
              onClick={() => {
                setCurrentCategory(null);
                handleAddCategory();
              }}
            >
              Add New Category
            </Button>
          ) }
        </Box>
      </Box>

      {/* Add Meal Modal */}
      <AddMealModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddSuccess={handleAddMealSuccess}
        currentProduct={currentProduct}
        isAdd={isAdd}
      />
      <AddNewCategory open={showAddCategory}
       onClose={() => setShowAddCategory(false)}
       onAddSuccess={handleAddMealSuccess}
       //currentCategory={currentCategory}
       isAdd={isAdd} />

      {/* Meal List */}
      <ul id="meals">
        {displayedProducts.map((product) => (
          <MealItem
            isAdmin={isAdmin}
            key={product.id}
            product={product}
            onEdit={handleEditMeal}
          />
        ))}
      </ul>
    </>
  );
}
