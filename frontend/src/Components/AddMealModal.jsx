import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography,Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import useHttp from "../hooks/useHttp";
import { addProduct, updateProduct } from "./ServerRequests";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function AddMealModal({
  open,
  onClose,
  onAddSuccess,
  currentProduct,
  isAdd,
}) {
  const [name, setName] = useState(currentProduct.name);
  const [imageUrl, setImageUrl] = useState(currentProduct.imageUrl);
  const [description, setDescription] = useState(currentProduct.description);
  const [stock, setstock] = useState(1);
  const [price,setPrice]=useState(currentProduct.price);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [units,setUnits]= useState(currentProduct.units);
  const [category, setCategory] = useState(currentProduct.category);

  const { sendRequest } = useHttp();

  // If currentProduct is provided (for edit), prefill form fields
  useEffect(() => {
    if (currentProduct) {
      setName(currentProduct.name);
      setImageUrl(currentProduct.imageUrl);
      setDescription(currentProduct.description);
      setPrice(currentProduct.price);
      setstock(currentProduct.stock || 1);
      setUnits(currentProduct.units);
      setCategory(currentProduct.category);
    }
  }, [currentProduct]);

  const handleSubmit = async () => {
    const productData = {
      name,
      imageUrl,
      description,
      price,
      units,
      stock,
      category,
    };

    try {
      setIsLoading(true);
      setError(null);

      if (!isAdd) {
        try {
          const response = updateProduct(currentProduct.id, productData);
          if (response) {
            alert("Updated Product Successfully ! ");
            window.location.reload();
          }
        } catch (error) {
          alert("There was an error : " + error);
        }
      } else {
        try {
          const response = addProduct(productData);
          if (response) {
            alert("Added Product Successfully ! ");
            window.location.reload();
          }
        } catch (error) {
          alert("There was an error : " + error);
        }
      }
      // onAddSuccess(); // Trigger the callback to refresh the list
      onClose(); // Close the modal
    } catch (err) {
      setError(err.message);
      alert("Failed to submit meal: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-meal-modal-title"
      aria-describedby="add-meal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="add-meal-modal-title" variant="h6" component="h2">
          {!isAdd ? "Edit Item" : "Add New Item"}
        </Typography>
        <form>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Image URL"
            fullWidth
            margin="normal"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
         <FormControl fullWidth margin="normal" required>
  <InputLabel>Category</InputLabel>
  <Select value={category} onChange={(e) => setCategory(e.target.value)}>
    <MenuItem value="FOOD">FOOD</MenuItem>
    <MenuItem value="VEGETABLES">VEGETABLES</MenuItem>
    <MenuItem value="SNACKS">SNACKS</MenuItem>
    <MenuItem value="BEVERAGES">BEVERAGES</MenuItem>
    <MenuItem value="DAIRY">DAIRY</MenuItem>
    <MenuItem value="MEAT">MEAT</MenuItem>
    <MenuItem value="TOBACO">TOBACO</MenuItem>
  </Select>
</FormControl>
            <TextField
            label="Price"
            fullWidth
            margin="normal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
           <TextField
            label="Units"
            fullWidth
            margin="normal" 
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            required
          />
          <TextField
            label="Stock"
            fullWidth
            margin="normal"
            type="number"
            value={stock}
            onChange={(e) => setstock(Math.max(1, e.target.value))}
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ marginTop: "20px" }}
            onClick={() => handleSubmit()}
          >
            {isLoading ? "Processing..." : !isAdd ? "Update Item" : "Add Item"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
