import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import useHttp from "../hooks/useHttp";
import ErrorPage from "./ErrorPage";
import { getAllOrders, updateOrderStatus } from "./ServerRequests"; // Assume you have an API call for updating status

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#2e2e2e",
    minHeight: "100vh",
    color: "#fff",
    width: "100%",
  },
  table: {
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "##2e2e2e",
    color: "#fff",
    fontWeight: "bold",
  },
  tableCell: {
    backgroundColor: "black",
    color: "black",
    border: "none",
    fontsize:"15px"
  },
};

const statusOptions = [
  "PREPARING",
  "READY",
  "DELIVERED",
  "CANCEL",
  "Cancelled (By User)",
  "Cancelled (By Admin)",
];

const AllOrders = () => {
  const [totalOrders, setOrders] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
      })
      .catch((error) => {
        console.error("Failed to update order status:", error);
      });
  };

  useEffect(() => {
    getAllOrders()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => console.error("Failed to fetch orders:", error));
  }, []);


  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <ErrorPage title="Failed to fetch orders" message={error.message} />;
  }

  return (
    <Box style={styles.container}>
      <Typography variant="h4" gutterBottom>
        All Orders
      </Typography>
      <TableContainer component={Paper} style={{ boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell style={styles.tableHeader}>Products</TableCell>
          
              <TableCell style={styles.tableHeader}>Customer Name</TableCell>
              <TableCell style={styles.tableHeader}>Customer Email</TableCell>
              <TableCell style={styles.tableHeader} align="center">
                Total Price
              </TableCell>
              <TableCell style={styles.tableHeader} align="center">
                Order Date
              </TableCell>
              <TableCell style={styles.tableHeader}>Order Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {totalOrders ? (
              totalOrders.map((order) => {
                // Dynamically modify status options for each order
                const dynamicStatusOptions = statusOptions.map((option) =>
                  order.deliveryType === "pickup" && option === "READY"
                    ? "READY FOR PICKUP"
                    : option
                );
  
                return (
                  <TableRow key={order.orderId}>
                     <TableCell>
                      <select
                        style={{
                          backgroundColor: "#f5f5f5",
                          color: "#000",
                          border: "1px solid #ccc",
                          padding: "5px",
                          width: "100%",
                        }}
                      >
                        {order.products.map((product) => (
                          <option
                            key={product.name}
                            value={product.name}
                          >
                            {`${product.name} (Qty: ${product.quantityBought})`}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                   
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.customerEmail}</TableCell>
                    <TableCell>${order.totalPayment.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.orderId, e.target.value)
                        }
                        disabled={
                          order.status === "Cancelled (By User)" ||
                          order.status === "Cancelled (By Admin)" ||
                          order.status === "DELIVERED"
                        }
                        style={{
                          backgroundColor: "#1d1a16",
                          color: "#d9e2f1",
                          border: "none",
                          padding: "5px",
                        }}
                      >
                        {dynamicStatusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <div style={{ display: "flex", width: "100%" }}>
                <p
                  style={{
                    justifyContent: "space-around",
                  }}
                >
                  No Orders at this time
                </p>
              </div>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}  

export default AllOrders;
