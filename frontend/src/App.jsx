import React, { useState, useEffect } from "react";
import LoginPage from "./Components/LoginPage";
import Cart from "./Components/Cart";
import Checkout from "./Components/Checkout";
import Header from "./Components/Header";
import Meals from "./Components/Meals";
import Sidebar from "./Components/Sidebar";
import CustomerOrders from "./Components/CustomerOrders";
import AllOrders from "./Components/AllOrders";
import AllUsers from "./Components/AllUsers";
import { CartContextProvider } from "./Components/Store/CartContext";
import { UserProgressContextProvider } from "./Components/Store/UserProgressContext";

function App() {
  const [currentPage, setCurrentPage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userDetails"))
  );

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    setLoggedIn(isLoggedIn);
  }, []);

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
          />
          
          <div style={{ marginLeft: "250px", width: "calc(100% - 250px)" }}>
  <Header isAdmin={userData.role === 'admin'} />
  
  {currentPage && !["your-orders", "all-orders", "all-users"].includes(currentPage) && (
    <Meals isAdmin={userData.role === 'admin'} category={currentPage} />
  )}
  
  {userData.role !== 'admin' && currentPage === "your-orders" && <CustomerOrders />}
  {userData.role === 'admin' && currentPage === "all-orders" && <AllOrders />}
  {userData.role === 'admin' && currentPage === "all-users" && <AllUsers />}
  
  <Cart />
  <Checkout />
          </div>
        </div>
      </CartContextProvider>
    </UserProgressContextProvider>
  );
}

export default App;
