import React, { useState } from "react";
import { Button, TextField, Box, Typography, Grid, CssBaseline, Paper } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { registerUser } from "../utils/api";
import { useNavigate  } from 'react-router-dom';
import signinimage from "../assets/signinimg.png";

const defaultTheme = createTheme();

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [nomEtablissements, setNomEtablissements] = useState(""); // New state for nomEtablissements
  const [cin, setCin] = useState(""); // New state for cin
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Send the new fields along with the other data
      await registerUser({ username, email, password, contact, nomEtablissements, cin });
      setSuccess("Registration successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
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
              Register
            </Typography>
            <Typography variant="body1">
              Create an account to get started.
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Enter Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Enter E-mail"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="Enter Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="contact"
                label="Enter Contact Information"
                name="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              {/* New fields */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="nomEtablissements"
                label="Enter Institution Name"
                name="nomEtablissements"
                value={nomEtablissements}
                onChange={(e) => setNomEtablissements(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="cin"
                label="Enter CIN"
                name="cin"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
              />
              {error && (
                <Typography color="red" variant="body2">
                  {error}
                </Typography>
              )}
              {success && (
                <Typography color="green" variant="body2">
                  {success}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "#7f56da" }}
              >
                Register
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
            backgroundImage: `url(${signinimage})`,
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

export default Register;
