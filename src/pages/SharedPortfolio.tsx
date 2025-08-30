import React from "react";
import { useParams } from "react-router-dom";
import { usePublicPortfolio } from "../api/queries/usePortfolios";
import {
  Avatar,
  Box,
  Stack,
  Tooltip as MuiTooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import CategoryIcon from "@mui/icons-material/Category";
import { PortfolioPrivacy } from "../types/api";
import { useTheme } from "../contexts/ThemeContext";

const SharedPortfolio: React.FC = () => {
  const { currentTheme } = useTheme();
  const { id } = useParams<{ id: string }>();

  const { data: publicPortfolio, isLoading, error } = usePublicPortfolio(
    Number(id)
  );

  const sortedStocks = React.useMemo(
    () =>
      [...(publicPortfolio?.portfolioStocks || [])].sort(
        (a, b) => b.percentage - a.percentage
      ),
    [publicPortfolio?.portfolioStocks]
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading portfolio</div>;
  if (!publicPortfolio) return <div>No portfolio found</div>;

  return (
    <div className="mx-auto">
      <Box className="flex items-center gap-2 mb-4 mt-4">
        <Typography
          variant="subtitle1"
          component="h1"
          sx={{ color: currentTheme.text.primary }}
        >
          {publicPortfolio.name}
        </Typography>
        <MuiTooltip title={getPrivacyInfo(publicPortfolio.privacy).text}>
          <span style={{ color: currentTheme.text.secondary }}>
            {getPrivacyInfo(publicPortfolio.privacy).icon}
          </span>
        </MuiTooltip>
      </Box>

      {publicPortfolio.privacy === PortfolioPrivacy.PRIVATE ? (
        <div style={{ color: currentTheme.text.primary }}>Private Portfolio</div>
      ) : (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
              color: currentTheme.text.secondary,
            }}
          >
            <Typography variant="body2">Stock</Typography>
            <Typography variant="body2">Weight</Typography>
          </Box>
          <Stack spacing={1}>
            {sortedStocks.map((stock) => (
              <Box
                key={stock.symbol}
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  p: 1.5,
                  borderRadius: 4,
                  backgroundColor: currentTheme.background.secondary,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: `${stock.percentage}%`,
                    backgroundColor: alpha(
                      currentTheme.accent.primary,
                      currentTheme.name === "Dark Theme" ? 0.4 : 0.2
                    ),
                  }}
                />
                <Avatar
                  sx={{
                    bgcolor: currentTheme.accent.primary,
                    mr: 2,
                    zIndex: 1,
                  }}
                >
                  {stock.name.charAt(0)}
                </Avatar>
                <Typography
                  sx={{ color: currentTheme.text.primary, zIndex: 1 }}
                >
                  {stock.name}
                </Typography>
                <Typography
                  sx={{
                    ml: "auto",
                    color: currentTheme.text.primary,
                    zIndex: 1,
                  }}
                >
                  {stock.percentage.toFixed(2)}%
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </div>
  );
};

export default SharedPortfolio;

const getPrivacyInfo = (privacy: string) => {
  switch (privacy) {
    case "PRIVATE":
      return { icon: <LockIcon />, text: "Private Portfolio" };
    case "SHARE_ALL":
      return { icon: <PublicIcon />, text: "Showing All Holdings" };
    case "SHARE_SECTORS":
      return { icon: <CategoryIcon />, text: "Showing Sector-wise Holdings" };
    default:
      return { icon: <PublicIcon />, text: "Public Portfolio" };
  }
};

