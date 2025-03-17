import React from "react";
import { Portfolio } from "../types/api";
import { useTheme } from "../contexts/ThemeContext";
import { Stack, Typography, Box, Paper } from "@mui/material";
import { formatAmount } from "../utils/helper";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

interface InvestmentPerformanceProps {
  portfolio?: Portfolio;
}

const InvestmentPerformance: React.FC<InvestmentPerformanceProps> = ({
  portfolio,
}) => {
  const { currentTheme } = useTheme();

  if (!portfolio) return null;

  const initialInvestment = portfolio.initialInvestment || 0;
  const profitLossValue = portfolio.profitLoss?.value || 0;
  const profitLossPercentage = portfolio.profitLoss?.percentage || 0;

  const isPositive = profitLossValue >= 0;

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: currentTheme.background.primary,
      }}
    >
      <Stack spacing={2} direction="row" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary">
            Initial Investment
          </Typography>
          <Typography variant="h6" sx={{ color: currentTheme.text.primary }}>
            {formatAmount(initialInvestment)}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{
              color: currentTheme.text.secondary,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            Total Return
            {isPositive ? (
              <TrendingUpIcon
                sx={{
                  color: "success.main",
                  fontSize: "1rem",
                }}
              />
            ) : (
              <TrendingDownIcon
                sx={{
                  color: "error.main",
                  fontSize: "1rem",
                }}
              />
            )}
            <Typography
              variant="body1"
              sx={{
                color: isPositive ? "success.main" : "error.main",
              }}
            >
              {isPositive ? "+" : ""}
              {profitLossPercentage.toFixed(2)}%
            </Typography>
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="h6"
              sx={{
                color: isPositive ? "success.main" : "error.main",
              }}
            >
              {isPositive ? "+" : ""}
              {formatAmount(profitLossValue)}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default InvestmentPerformance;
