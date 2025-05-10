import { useContext, useState } from "react";
import { TextField, Select, MenuItem, Button, Box } from "@mui/material";
import logoImg from "../assets/logoImg.jpg";
import Buttons from "./UI/Buttons";
import CartContext from "./Store/CartContext.jsx";
import UserProgressContext from "./Store/UserProgressContext.jsx";
import AddMealModal from "./AddMealModal";

export default function Header({
  isAdmin,
  onSearch,
  onSort,
  onAddSuccess,
  category,
}) {
  const crtCntxt = useContext(CartContext);
  const cartValue = crtCntxt.items.reduce((totalItems, item) => totalItems + item.quantity, 0);
  const userProgressCtx = useContext(UserProgressContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleShowCart = () => userProgressCtx.showCart();

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSortChange = (e) => {
    const sort = e.target.value;
    setSortOption(sort);
    onSort(sort);
  };

  const handleAddMeal = () => setShowAddModal(true);
  const handleAddCategory = () => setShowAddCategory(true);

  return (
    <header id="main-header">
      <div id="title">
        <img src={logoImg} alt="Store Logo" />
        <h1>Grocery Store</h1>
      </div>
      <nav>
        {!isAdmin && <Buttons onClick={handleShowCart}>Cart ({cartValue})</Buttons>}
        {isAdmin && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Select
              value={sortOption}
              onChange={handleSortChange}
              displayEmpty
              size="small"
            >
              <MenuItem value="">Sort By</MenuItem>
              <MenuItem value="A-Z">A-Z</MenuItem>
              <MenuItem value="Z-A">Z-A</MenuItem>
              <MenuItem value="price: low to high">Price: Low to High</MenuItem>
              <MenuItem value="price: high to low">Price: High to Low</MenuItem>
            </Select>
            <Button variant="contained" onClick={handleAddMeal}>
              Add New Item
            </Button>
            
          </Box>
        )}
      </nav>

      <AddMealModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddSuccess={onAddSuccess}
        currentProduct={{
          name: "",
          imageUrl: "",
          stock: 1,
          description: "",
          units: "",
          price: "",
          category: category,
        }}
        isAdd={true}
      />
      
    </header>
  );
}
