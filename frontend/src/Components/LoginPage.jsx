import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper,Grid } from "@mui/material";
import { registerUser, loginUser } from "./ServerRequests"; // Import API functions

function LoginPage({ setLoggedIn, setUserData }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const[confirmPassword,setConfirmPassword]=useState("");
  const [error, setError] = useState("");

  const togglePage = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser({ email, password });
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userDetails", JSON.stringify(userData));
      console.log(userData);
      setUserData(userData);
      setLoggedIn(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
         firstName,
         lastName,
         dob,
        email,
        password,
        phoneNumber,
        address: [`${street}, ${city}, ${state}, ${zip}`], // Address as a single formatted string
      };
      console.log("Signup Payload:", newUser); // Log payload for debugging
      await registerUser(newUser);
      alert("Signup successful! Please log in.");
      setIsLogin(true);
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      alert(error.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundImage: "url('/background.png')", // Path to your image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        "&::after": {
          content: "''",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Fading effect
          zIndex: 1,
        },
      }}
    >
      <Paper
        elevation={5}
        sx={{
          padding: "30px",
          width: "400px",
          zIndex: 2,
          textAlign: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
          backdropFilter: "blur(8px)", // Blur for frosted-glass effect
          border: "1px solid rgba(255, 255, 255, 0.3)", // Optional border for enhanced visibility
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Softer shadow to match transparency
          borderRadius: "20px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          {isLogin ? "Login" : "Sign Up"}
        </Typography>
        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          {!isLogin && (
            <>
              <TextField
                label="firstName"
                fullWidth
                margin="normal"
                value={firstName}
                onChange={(e) => setName(e.target.value)}
                required
              />
               <TextField
                label="lastName"
                fullWidth
                margin="normal"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
               <TextField
                label="DOB"
                type="date"
                fullWidth
                margin="normal"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
              <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <Typography variant="subtitle1" sx={{ textAlign: "left", mt: 2 }}>
                Address:
              </Typography>
              <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Street"
            fullWidth
            margin="normal"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="City"
            fullWidth
            margin="normal"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="State"
            fullWidth
            margin="normal"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Zip Code"
            fullWidth
            margin="normal"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            required
          />
        </Grid>
      </Grid>
            </>
          )}
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            fullWidth
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        error={!!error} // Shows red border if there's an error
        helperText={error} // Displays the error message
      />}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>
        <Button variant="text" onClick={togglePage}>
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </Button>
      </Paper>
    </Box>
  );
}

export default LoginPage;
