import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Star,
  StarBorder,
} from "@mui/icons-material";
import {
  cancelOrder,
  getCustomerOrders,
  updateProductRating,
} from "./ServerRequests.jsx";
import "./CustomerOrders.css";
import Buttons from "./UI/Buttons.jsx";

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openRow, setOpenRow] = useState({});
  const [ratings, setRatings] = useState({});
  const userData = JSON.parse(localStorage.getItem("userDetails"));

  const fetchOrders = async () => {
    try {
      const data = await getCustomerOrders(userData.userId);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch past orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = useCallback(async (id, status) => {
    if (status === "READY" || status === "READY FOR PICKUP") {
      alert("Order cannot be canceled as it is READY. Refund cannot be issued.");
    } else {
      await cancelOrder(id);
      alert("Order Cancelled, Refund will be processed in 3-5 business days. by admin.");
      fetchOrders(); // Refresh order data
    }
  }, []);

  const handleRatingChange = (productId, rating) => {
    try {
      updateProductRating(userData.userId, productId, rating);
      alert("Rating updated successfully");
      setRatings((prev) => ({ ...prev, [productId]: rating }));
    } catch (error) {
      alert("Error : " + error);
    }
  };

  const handleReturnOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/refund/${orderId}`, {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        alert("Return processed successfully!");
        fetchOrders(); // Refresh order data to include refund info
      } else {
        alert("Return failed: " + data);
      }
    } catch (err) {
      alert("Return request failed");
      console.error(err);
    }
  };

  const isReturnEligible = (orderDate) => {
    const deliveredDate = new Date(orderDate);
    const now = new Date();
    const diffInDays = (now - deliveredDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 30;
  };

  const toggleRow = (orderId) => {
    setOpenRow((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const renderStars = (productId) => {
    const currentRating = ratings[productId] || 0;
    return (
      <Box>
        {[1, 2, 3, 4, 5].map((value) => (
          <IconButton
            key={value}
            onClick={() => handleRatingChange(productId, value)}
            size="small"
            style={{ color: value <= currentRating ? "#FFD700" : "#ccc" }}
          >
            {value <= currentRating ? <Star /> : <StarBorder />}
          </IconButton>
        ))}
      </Box>
    );
  };

  const renderTable = (orders, title) => {
    return (
      <>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Box p={2}><Typography>No Orders at this time</Typography></Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Order Date</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Order Status</TableCell>
                  <TableCell>Delivery Type</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <React.Fragment key={order.orderId}>
                    <TableRow>
                      <TableCell>
                        <IconButton size="small" onClick={() => toggleRow(order.orderId)}>
                          {openRow[order.orderId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>${order.totalPayment?.toFixed(2)}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>{order.deliveryType}</TableCell>
                      <TableCell>
                        {["PLACED", "READY", "READY FOR PICKUP", "PREPARING"].includes(order.status) ? (
                          <Buttons onClick={() => handleCancelOrder(order.orderId, order.status)}>
                            Cancel Order
                          </Buttons>
                        ) : ["DELIVERED", "CANCELLED"].includes(order.status) && isReturnEligible(order.orderDate) ? (
                          <Buttons onClick={() => handleReturnOrder(order.orderId)}>
                            Return
                          </Buttons>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                        <Collapse in={openRow[order.orderId]} timeout="auto" unmountOnExit>
                          <Box margin={2}>
                            <Typography variant="subtitle1" gutterBottom>
                              Order Items
                            </Typography>
                            <Table size="small" aria-label="order items">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Product Name</TableCell>
                                  <TableCell>Quantity Bought</TableCell>
                                  <TableCell>Rate Product</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {order.products.map((product, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.quantityBought}</TableCell>
                                    <TableCell>{renderStars(product.productId)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>

                            {order.status === "RETURNED" && (
                              <Box mt={2}>
                                <Typography variant="subtitle2">Refund Summary</Typography>
                                <Typography variant="body2">
                                  <strong>Total Refund Amount:</strong>{" "}
                                  ${order.totalRefundAmount?.toFixed(2) || "0.00"}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Refunded Products:</strong>{" "}
                                  {order.refundedProducts?.join(", ") || "None"}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Non-Refundable Products:</strong>{" "}
                                  {order.notRefundedProducts?.join(", ") || "None"}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </>
    );
  };

  return renderTable(orders, "Your Orders");
};

export default CustomerOrders;
