import React from "react";
import { Typography, Box } from "@mui/material";
import { useTheme } from "../contexts/ThemeContext";

const Logo = () => {
  const { currentTheme } = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontSize: "20px",
          fontFamily: currentTheme.typography.fontFamily,
          fontWeight: currentTheme.typography.fontWeights.heading,
          color: currentTheme.text.primary,
          letterSpacing: 0,
        }}
      >
        NEPSE
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontSize: "16px",
          fontFamily: currentTheme.typography.fontFamily,
          fontWeight: currentTheme.typography.fontWeights.heading,
          color: currentTheme.accent.primary,
          letterSpacing: 0,
          marginTop: "-8px",
        }}
      >
        LEADER
      </Typography>
    </Box>
  );
};

export default Logo;
