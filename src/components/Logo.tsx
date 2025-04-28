import React from "react";
import { Typography, Box } from "@mui/material";

const Logo = () => {
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
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          color: "#2e7d32",
        }}
      >
        NEPSE
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontSize: "16px",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          color: "#2e7d32",
          marginTop: "-8px",
        }}
      >
        LEADER
      </Typography>
    </Box>
  );
};

export default Logo;
