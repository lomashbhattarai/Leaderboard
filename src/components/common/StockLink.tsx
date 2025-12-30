import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, IconButton, Tooltip } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useTheme } from "../../contexts/ThemeContext";

interface StockLinkProps {
  symbol: string;
}

const StockLink: React.FC<StockLinkProps> = ({ symbol }) => {
  const { currentTheme } = useTheme();

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        "&:hover .external-link-icon": {
          opacity: 0.6,
        },
      }}
    >
      <RouterLink
        to={`/stock/${symbol}`}
        className="hover:underline"
        style={{
          color: currentTheme.accent.primary,
          textDecoration: "none",
          fontWeight: currentTheme.typography.fontWeights.heading,
        }}
      >
        {symbol}
      </RouterLink>
      <Tooltip title="View on Nepse Alpha" placement="top">
        <IconButton
          component="a"
          href={`https://nepsealpha.com/trading/chart?symbol=${symbol}`}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          className="external-link-icon"
          sx={{
            padding: 0.25,
            opacity: 0,
            transition: "opacity 0.2s",
            "&:hover": {
              opacity: 1,
              backgroundColor: "transparent",
            },
          }}
        >
          <OpenInNewIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default StockLink;
