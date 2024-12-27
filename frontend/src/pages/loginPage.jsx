import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Grid, CssBaseline, Paper } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styled from "styled-components";
import { jwtDecode } from "jwt-decode"; 
import { loginUser } from "../utils/api";
import loginimage from "../assets/loginimage2.png";

const defaultTheme = createTheme();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginUser({ email, password });
      const token = response.data.token;

      // Store the token in localStorage
      localStorage.setItem("authToken", token);

      // Decode the token to extract user information
      const decodedToken = jwtDecode(token);
      console.log("User ID:", decodedToken.id);
      console.log("Role:", decodedToken.role);

      // Redirect based on role
      if (decodedToken.role === "ADMIN") {
        navigate("/admin-dash", { replace: true });
      } else if (decodedToken.role === "RESIDENT") {
        navigate("/resident-dash", { replace: true });
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "95vh", width: "95vw" }}>
        <CssBaseline />
        <Grid
          item
          xs={12}
          sm={6}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Box
            sx={{
              width: "90%",
              maxWidth: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
              Login
            </Typography>
            <Typography variant="body1">
              Welcome back! Please enter your credentials.
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Enter your email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <StyledLink href="/forgot-password">Forgot password?</StyledLink>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "#7f56da" }}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={6}
          md={7}
          sx={{
            backgroundImage: `url(${loginimage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
          }}
        />
      </Grid>
    </ThemeProvider>
  );
};

export default Login;

const StyledLink = styled.a`
  margin-top: 10px;
  display: block;
  text-align: right;
  color: #7f56da;
  text-decoration: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;
