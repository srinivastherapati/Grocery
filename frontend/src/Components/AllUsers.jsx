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
  CircularProgress,
} from "@mui/material";
import useHttp from "../hooks/useHttp";
import ErrorPage from "./ErrorPage";
import { getAllCustomers } from "./ServerRequests";
import "./customerorders.css"; 

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#2e2e2e",
    color: "#fff",
    borderRadius: "8px",
  },
  tableHeader: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#424242",
    border: "none",
  },
  tableCell: {

    fontSize: "16px",
    color: "black",
    borderBottom: "1px solid #424242",
  },
};


const AllUsers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllCustomers()
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((error) => setError(error || "Failed to fetch customers"));
  }, []);

  if (isLoading) {
    return (
      <Box className="loading-spinner">
        <CircularProgress className="MuiCircularProgress-root" />
      </Box>
    );
  }
  if (error) {
    return <ErrorPage title="Failed to fetch customers" message={error.message} />;
  }

  return (
    <Box className={styles.container}>
      <TableContainer>
        <Table className="MuiTable-root">
          <TableHead className="MuiTableHead-root">
            <TableRow>
              <TableCell className="MuiTableCell-root">Customer Name</TableCell>
              <TableCell className="MuiTableCell-root">Customer Email</TableCell>
              <TableCell className="MuiTableCell-root" align="center">
                Number of Orders
              </TableCell>
              <TableCell className="MuiTableCell-root" align="center">
                Total Order Value
              </TableCell>
              <TableCell className="MuiTableCell-root" align="center">
                Last Order Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="MuiTableBody-root">
            {customers ?customers.map((customer, idx) => (
              <TableRow key={idx} className="MuiTableRow-root">
                <TableCell className="MuiTableCell-root">
                  {customer.customerName}
                </TableCell>
                <TableCell className="MuiTableCell-root">
                  {customer.customerEmail}
                </TableCell>
                <TableCell className="MuiTableCell-root" align="center">
                  {customer.numberOfOrders}
                </TableCell>
                <TableCell className="MuiTableCell-root" align="center">
                  ${customer.customerTotalOrderValue.toFixed(2)}
                </TableCell>
                <TableCell className="MuiTableCell-root" align="center">
                  {customer.numberOfOrders !== 0
                    ? new Date(customer.lastOrderDate).toLocaleDateString()
                    : "Order not Placed"}
                </TableCell>
              </TableRow>
            )):(
              <div style={{ display: "flex", width: "100%" }}>
                <p
                  style={{
                    justifyContent: "space-around",
                  }}
                >
                  No Users at this time
                </p>
              </div>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllUsers;
