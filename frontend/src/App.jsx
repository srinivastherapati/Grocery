import React, { useState, useEffect } from "react";
import LoginPage from "./Components/LoginPage";
import Cart from "./Components/Cart";
import Checkout from "./Components/Checkout";
import Header from "./Components/Header";
import Meals from "./Components/Meals";
import Sidebar from "./Components/Sidebar";
import { getCategories } from "./Components/ServerRequests.jsx"; // Import getCategories
import CustomerOrders from "./Components/CustomerOrders";
import AllOrders from "./Components/AllOrders";
import AllUsers from "./Components/AllUsers";
import { CartContextProvider } from "./Components/Store/CartContext";
import { UserProgressContextProvider } from "./Components/Store/UserProgressContext";

function App() {
  const [currentPage, setCurrentPage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userDetails"))
  );

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    setLoggedIn(isLoggedIn);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories || []); // Ensure it's an array
        setCategoryError(null);
      } catch (error) {
        setCategoryError(error.message || "Failed to fetch categories");
        setCategories([]); // Set to empty array on error
      } finally {
        setIsLoadingCategories(false);
      }
    };

    if (loggedIn) { // Only fetch if logged in
       fetchCategories();
    } else {
       // Clear categories if logged out
       setCategories([]);
       setIsLoadingCategories(true); // Reset loading state for next login
       setCategoryError(null);
    }
  }, [loggedIn]); // Re-fetch if login status changes

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <LoginPage setUserData={setUserData} setLoggedIn={setLoggedIn} />;
  }

  const mainContainerStyle = {
    display: "flex",
    height: "100vh",
  };

  return (
    <UserProgressContextProvider>
      <CartContextProvider>
        <div style={mainContainerStyle}>
          <Sidebar
            userData={userData}
            onLogout={handleLogout}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            categories={categories} // New prop
            isLoadingCategories={isLoadingCategories} // New prop
            categoryError={categoryError} // New prop
          />
          
          <div style={{ marginLeft: "250px", width: "calc(100% - 250px)" }}>
            <Header isAdmin={userData.role==='admin'} />
            
            {/* Handle loading and error states for categories */}
            {loggedIn && isLoadingCategories && <p>Loading categories...</p>}
            {loggedIn && !isLoadingCategories && categoryError && <p>Error loading categories: {categoryError}</p>}
            
            {/* Render Meals component if a category is selected and loaded */}
            {loggedIn && !isLoadingCategories && !categoryError && categories.find(cat => cat.name.toLowerCase() === currentPage.toLowerCase()) && (
              <Meals 
                isAdmin={userData.role === 'admin'} 
                category={categories.find(cat => cat.name.toLowerCase() === currentPage.toLowerCase()).name} 
              />
            )}

            {/* Keep other currentPage checks for non-category pages */}
            {userData.role!='admin' && currentPage == "your-orders" && <CustomerOrders />}
            {userData.role==='admin' && currentPage == "all-orders" && <AllOrders />}
            {userData.role==='admin' && currentPage == "all-users" && <AllUsers />}
            <Cart />
            <Checkout />
          </div>
        </div>
      </CartContextProvider>
    </UserProgressContextProvider>
  );
}

export default App;
