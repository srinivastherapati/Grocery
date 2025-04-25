import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

const AddCategoryModal = ({ open, onClose, onAddSuccess }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onAddSuccess callback with the new category data
    onAddSuccess({ name: categoryName, description: categoryDescription });

    // Reset the form and close the modal
    setCategoryName("");
    setCategoryDescription("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: "10px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ marginBottom: "20px" }}>
          Add New Category
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="Category Description"
            variant="outlined"
            fullWidth
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            multiline
            rows={4}
            sx={{ marginBottom: "20px" }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              sx={{ borderRadius: "10px" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#ffc404",
                color: "black",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#e6b800" },
              }}
            >
              Add Category
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddCategoryModal;
