import axios from "axios";

export const API_BASE_URL = "http://localhost:8080/api";
// Register user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/customer/register`,
      userData
    );
    return await response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error registering user");
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/customer/login`,
      credentials
    );
    return await response.data;
  } catch (error) {
    throw new Error(
      error.response.data || "Error logging in, Please try again"
    );
  }
};

export const getCustomerOrders = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/customer/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.data;
  } catch (e) {
    console.error(e);
  }
};
export const getAllOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/get`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.data;
  } catch (e) {
    console.error(e);
  }
};
export const getAllCustomers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customer/get`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.data;
  } catch (e) {
    console.error(e);
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/orders/update-status/${orderId}/${newStatus}`
    );
    return response.data; // Return the response data if needed
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error; // Propagate the error to the caller
  }
};
export const cancelOrder = async (id) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/orders/cancel-order/${id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    return await response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error canceling order");
  }
};

export const updateQuantity = async (productId, type) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/order-items/update-quantity/${productId}`,
      { type: type }
    );
    return response.data; // Return the response data if needed
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error; // Propagate the error to the caller
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/products/delete/${productId}`
    );
    return response.data; // Return the response data if needed
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error; // Propagate the error to the caller
  }
};

export const addProduct = async (product) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products/add`, product);
    return response; // Return the response data if needed
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error; // Propagate the error to the caller
  }
};

export const updateProduct = async (productId, product) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/products/update/${productId}`,
      product
    );
    return response; // Return the response data if needed
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error; // Propagate the error to the caller
  }
};

export const updateProductRating = async (userId, productId, rating) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/review/add/${userId}/${productId}?rating=${rating}`
    );
    return response; // Return the response data if needed
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
