import React from "react";
import "./Sidebar.css";
import Buttons from "./UI/Buttons";

const Sidebar = ({ 
  userData, 
  onLogout, 
  currentPage, 
  setCurrentPage, 
  categories, 
  isLoadingCategories, 
  categoryError 
}) => {
  // isActive can be simplified or used for static items if any remain in this exact style
  // For dynamic categories, the active check will be inline

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Hello, {userData.userName}</h2>
      <div>
        <ul className="sidebar-categories">
          {/* Dynamic Categories Section */}
          {isLoadingCategories && (
            <li>Loading categories...</li>
          )}
          {categoryError && (
            <li style={{ color: 'red' }}>Error: {categoryError}</li>
          )}
          {!isLoadingCategories && !categoryError && categories && categories.length > 0 && (
            categories.map((category) => (
              <li
                key={category.id}
                className={currentPage.toLowerCase() === category.name.toLowerCase() ? "active" : ""}
                onClick={() => setCurrentPage(category.name)}
              >
                {category.name.toUpperCase()}
              </li>
            ))
          )}
          {!isLoadingCategories && !categoryError && categories && categories.length === 0 && (
            <li>No categories available.</li>
          )}

          {/* Static Links */}
          {userData.role !== "admin" && (
            <li 
              className={currentPage === "your-orders" ? "active" : ""} 
              onClick={() => setCurrentPage("your-orders")}
            >
              YOUR ORDERS
            </li>
          )}
          {userData.role === "admin" && (
            <li 
              className={currentPage === "all-orders" ? "active" : ""} 
              onClick={() => setCurrentPage("all-orders")}
            >
              ORDERS
            </li>
          )}
          {userData.role === "admin" && (
            <li 
              className={currentPage === "all-users" ? "active" : ""} 
              onClick={() => setCurrentPage("all-users")}
            >
              USERS
            </li>
          )}
        </ul>
      </div>
      <div className="sidebar-footer">
        <p className="user-details">{userData.userEmail}</p>
        <Buttons onClick={onLogout}>Logout</Buttons>
      </div>
    </div>
  );
};

export default Sidebar;
