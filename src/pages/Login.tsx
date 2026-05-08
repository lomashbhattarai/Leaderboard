import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import { useTheme } from "../contexts/ThemeContext";
import { getCommonStyles } from "../themes/commonComponents";
import { useAuth } from "../api/queries/useAuth";
import { showToast } from "../utils/toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginMutation } = useAuth();
  const { currentTheme } = useTheme();
  const styles = getCommonStyles(currentTheme);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          showToast.success("Successfully logged in!");
        },
        onError: (error) => {
          showToast.error("Login failed. Please check your credentials.");
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
          Login
        </Typography>
        <form onSubmit={handleSubmit} data-testid="login-form">
          <TextField
            inputProps={{ "data-testid": "email-input" }}
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
            inputProps={{ "data-testid": "password-input" }}
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
            data-testid="login-submit"
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 2,
              backgroundColor: currentTheme.accent.primary,
              color: currentTheme.text.inverse,
              '&:hover': {
                backgroundColor: currentTheme.accent.secondary,
              },
            }}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
          <Box mt={2} textAlign="center">
            <Link
              to="/signup"
              style={{ color: currentTheme.accent.primary }}
            >
              Don't have an account? Sign up
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
