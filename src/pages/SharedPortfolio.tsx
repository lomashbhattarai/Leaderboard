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
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
} from "recharts";

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

  const [chartDimensions, setChartDimensions] = React.useState({
    height: 350,
    outerRadius: 100,
    fontSize: "10px",
  });

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setChartDimensions({
          height: 300,
          outerRadius: 100,
          fontSize: "10px",
        });
      } else {
        setChartDimensions({
          height: 400,
          outerRadius: 130,
          fontSize: "12px",
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            {sortedStocks.map((stock) => {
              const displayName = stock.name || stock.symbol;
              const initials = displayName?.charAt(0) || "";
              return (
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
                    {initials}
                  </Avatar>
                  <Typography
                    sx={{ color: currentTheme.text.primary, zIndex: 1 }}
                  >
                    {displayName}
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
              );
            })}
          </Stack>
          <Box
            sx={{
              mt: 4,
              height: chartDimensions.height,
              fontSize: chartDimensions.fontSize,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={publicPortfolio.portfolioStocks}
                  dataKey="percentage"
                  nameKey="symbol"
                  cx="50%"
                  cy="50%"
                  outerRadius={chartDimensions.outerRadius}
                  fill={currentTheme.accent.primary}
                  label={({ symbol, percent }) =>
                    `${symbol} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {publicPortfolio.portfolioStocks?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      )}
    </div>
  );
};
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

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
];

export default SharedPortfolio;

