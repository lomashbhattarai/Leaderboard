import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import { useTheme } from "../contexts/ThemeContext";
import { getCommonStyles } from "../themes/commonComponents";
import { useAuth } from "../api/queries/useAuth";
import { showToast } from "../utils/toast";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { signupMutation } = useAuth();
  const { currentTheme } = useTheme();
  const styles = getCommonStyles(currentTheme);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate(
      { email, password, fullName },
      {
        onSuccess: () => {
          showToast.success("Account created successfully!");
        },
        onError: (error) => {
          showToast.error("Failed to create account. Please try again.");
        },
      }
    );
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      sx={{
        backgroundColor: currentTheme.background.primary,
        color: currentTheme.text.primary,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          ...styles.paper,
          backgroundColor: currentTheme.background.secondary,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: currentTheme.typography.fontWeights.heading,
            color: currentTheme.text.primary,
          }}
        >
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            sx={{
              '& label.Mui-focused': {
                color: currentTheme.accent.primary,
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: currentTheme.accent.secondary,
                },
                '&:hover fieldset': {
                  borderColor: currentTheme.accent.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: currentTheme.accent.primary,
                },
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            sx={{
              '& label.Mui-focused': {
                color: currentTheme.accent.primary,
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: currentTheme.accent.secondary,
                },
                '&:hover fieldset': {
                  borderColor: currentTheme.accent.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: currentTheme.accent.primary,
                },
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            sx={{
              '& label.Mui-focused': {
                color: currentTheme.accent.primary,
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: currentTheme.accent.secondary,
                },
                '&:hover fieldset': {
                  borderColor: currentTheme.accent.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: currentTheme.accent.primary,
                },
              },
            }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 2,
              backgroundColor: currentTheme.accent.primary,
              color: "#fff",
              '&:hover': {
                backgroundColor: currentTheme.accent.secondary,
              },
            }}
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? "Signing up..." : "Sign Up"}
          </Button>
          <Box mt={2} textAlign="center">
            <Link to="/login" style={{ color: currentTheme.accent.primary }}>
              Already have an account? Login
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
