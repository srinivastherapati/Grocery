import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import Buttons from "./UI/Buttons";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  Divider,
} from "@mui/material";

const Sidebar = ({ userData, onLogout, currentPage, setCurrentPage }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const isActive = (page) => currentPage === page;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/categories/all");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await axios.post("http://localhost:8080/api/categories/add", newCategory);
      setNewCategory("");
      fetchCategories();
      setOpenDialog(false);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data || "Error adding category");
    }
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Hello, {userData.userName}</h2>

      <ul className="sidebar-categories">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className={isActive(cat.name.toLowerCase()) ? "active" : ""}
            onClick={() => setCurrentPage(cat.name.toLowerCase())}
          >
            {cat.name}
          </li>
        ))}

        {userData.role !== "admin" && (
          <li
            className={isActive("your-orders") ? "active" : ""}
            onClick={() => setCurrentPage("your-orders")}
          >
            YOUR ORDERS
          </li>
        )}

        {userData.role === "admin" && (
          <>
            <li
              className={isActive("all-orders") ? "active" : ""}
              onClick={() => setCurrentPage("all-orders")}
            >
              ORDERS
            </li>
            <li
              className={isActive("all-users") ? "active" : ""}
              onClick={() => setCurrentPage("all-users")}
            >
              USERS
            </li>

            <li>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenDialog(true)}
              >
                +Add Category
              </Button>
            </li>
          </>
        )}
      </ul>

      <div className="sidebar-footer">
        <p className="user-details">{userData.userEmail}</p>
        <Buttons onClick={onLogout}>Logout</Buttons>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add a New Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            margin="normal"
          />

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Existing Categories:
          </Typography>
          <List dense>
            {categories.map((cat) => (
              <ListItem key={cat.id}>{cat.name}</ListItem>
            ))}
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddCategory} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sidebar;
