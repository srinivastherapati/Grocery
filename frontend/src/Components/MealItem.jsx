import { useContext, useState } from "react";
import Buttons from "./UI/Buttons";
import CartContext from "./Store/CartContext";

import ClearIcon from "@mui/icons-material/Clear";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { deleteProduct } from "./ServerRequests";
import { updateProduct } from "./ServerRequests";

export default function MealItem({ product, isAdmin, onEdit }) {
  const cartContxt = useContext(CartContext);
  const [quantity, setQuantity] = useState(product.stock);
  const [isEditingUnits, setIsEditingUnits] = useState(false);
  const [updatedUnits, setUpdatedUnits] = useState(product.units);

  const cartItem = cartContxt.items.find((item) => item.id === product.id);
const addedQuantity = cartItem ? cartItem.quantity : 0;


  function handleAddMeal() {
    cartContxt.addItems({ ...product, quantity });
  }
  const handleUnitChange = (e) => {
    setUpdatedUnits(e.target.value);
  };

  const saveUnits = async () => {
    try {
      // Update product units via the API
      const updatedProduct = { ...product, units: updatedUnits };
      await updateProduct(product.id, updatedProduct);
      
      setIsEditingUnits(false);
       // Close the input field after saving
       window.location.reload()
    } catch (error) {
      console.error("Error updating units:", error);
    }
  };

  function handleDelete() {
    try {
      let val = confirm("Are you sure you want to delete?");
      if (val === false) return;
      console.log("Delete meal:", product);
      deleteProduct(product.id);
      alert("Deleted Product Successfully !");
      window.location.reload();
    } catch (error) {
      alert("Error : " + error);
    }
    // Logic for deleting the meal
  }

  function incrementQuantity() {
    try {
      updateQuantity(quantity, "increment");
      alert("Sucessfully updated quantity");
    } catch (error) {
      alert("There was an error : " + error);
    }
    setQuantity((prevQuantity) => prevQuantity + 1);
  }

  function decrementQuantity() {
    try {
      updateQuantity(quantity, "decrement");
      alert("Sucessfully updated quantity");
    } catch (error) {
      alert("There was an error : " + error);
    }
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  }

  return (
    <li className="meal-item">
      <article>
        <img src={`${product.imageUrl}`} alt={product.name} />
        <div>
          <h3>
            {product.name}{" "}
            <span>
              <StarHalfIcon style={{ fontSize: "18px", color: "#ffc404" }} />{" "}
              {product.rating}
            </span>{" "}
          </h3>
          <p className="meal-item-price">${product.price}</p>
          <p className="meal-item-price">
  {product.category === "FOOD" ? "" : isAdmin && isEditingUnits ? (
    <select
      value={updatedUnits}
      onChange={handleUnitChange}
      onBlur={saveUnits} 
      autoFocus
    >
      <option value="KGS">kgs</option>
      <option value="LBS">lbs</option>
      <option value="PACKET">packet</option>
      <option value="GALLONS">gallon</option>
      <option value="LITERS">liter</option>
      
    </select>
  ) : (
    <span onClick={() => isAdmin && setIsEditingUnits(true)}>
      {product.units}
    </span>
  )}
</p>

          <p className="meal-item-description">{product.description}</p>
        </div>
        <p className="meal-item-actions">
          {!isAdmin && (
  <>
    <Buttons onClick={handleAddMeal}>Add to Cart</Buttons>
    {addedQuantity > 0 && (
      <span style={{ marginLeft: '10px', color: '#ffc404' }}>
        Added: {addedQuantity}
      </span>
    )}
  </>
)}

          {isAdmin && (
            <div className="admin-actions">
              <EditIcon
                sx={{ color: "#ffc404" }}
                onClick={() => onEdit(product)} // Call onEdit when Edit button is clicked
                aria-label="Edit"
              />
              <div className="quantity-controls">
                {/* <RemoveIcon
                  sx={{ color: "#ffc404" }}
                  onClick={decrementQuantity}
                  aria-label="Decrease Quantity"
                /> */}
                <p>{product.category==="FOOD"? "":product.stock}</p>
                {/* <AddIcon
                  sx={{ color: "#ffc404" }}
                  onClick={incrementQuantity}
                  aria-label="Increase Quantity"
                /> */}
              </div>
              <ClearIcon sx={{ color: "#ffc404" }} onClick={handleDelete} />
            </div>
          )}
        </p>
      </article>
    </li>
  );
}
