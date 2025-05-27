import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { addCategory } from "./ServerRequests.jsx"; // Import addCategory

const AddCategoryModal = ({ open, onClose, onAddSuccess }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const categoryData = {
      name: categoryName,
      description: categoryDescription === "" ? null : categoryDescription,
    };

    try {
      await addCategory(categoryData);
      onAddSuccess(); // Parent handles success (e.g., reload, close modal via its own state)
      
      // Reset form and close modal on success, as per original flow
      setCategoryName("");
      setCategoryDescription("");
      onClose(); 
    } catch (err) {
      setSubmitError(err.message || "An unexpected error occurred while adding the category.");
    } finally {
      setIsSubmitting(false);
    }
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
          {submitError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {submitError}
            </Typography>
          )}
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
              disabled={isSubmitting}
              sx={{
                backgroundColor: "#ffc404",
                color: "black",
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#e6b800" },
              }}
            >
              {isSubmitting ? "Adding..." : "Add Category"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddCategoryModal;
