import React from "react";
import { Portfolio } from "../types/api";
import { useTheme } from "../contexts/ThemeContext";
import { getCommonStyles } from "../themes/commonComponents";
import AmountSummary from "./common/AmountSummary";
import { Stack, Typography, Box, Paper } from "@mui/material";
import { formatPerformance } from "../pages/Leaderboard";
import { formatAmount } from "../utils/helper";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

interface PortfolioValueProps {
  portfolio?: Portfolio;
}

const PortfolioValue: React.FC<PortfolioValueProps> = ({ portfolio }) => {
  const { currentTheme } = useTheme();
  const styles = getCommonStyles(currentTheme);

  // Helper function to calculate change data
  const getChangeData = (change: number, percentage: number) => {
    const isPositive = change >= 0;
    return {
      isPositive,
      change,
      percentage,
      formattedChange: Math.abs(change),
      formattedPercentage: percentage,
    };
  };

  // 24h change
  const oneDayData = getChangeData(
    portfolio?.historicalValues?.oneDayAgo?.change || 0,
    portfolio?.historicalValues?.oneDayAgo?.percentage || 0
  );

  // 1W change
  const oneWeekData = getChangeData(
    portfolio?.historicalValues?.oneWeekAgo?.change || 0,
    portfolio?.historicalValues?.oneWeekAgo?.percentage || 0
  );

  // 1M change
  const oneMonthData = getChangeData(
    portfolio?.historicalValues?.oneMonthAgo?.change || 0,
    portfolio?.historicalValues?.oneMonthAgo?.percentage || 0
  );

  // Total investment performance (using actual data from API now)
  const initialInvestment = portfolio?.initialInvestment || 0;
  const currentValue = portfolio?.currentValue || 0;
  const totalChange = portfolio?.profitLoss?.value || 0;
  const totalChangePercentage = portfolio?.profitLoss?.percentage || 0;
  const totalReturnData = getChangeData(totalChange, totalChangePercentage);

  // All the calculated data is available in these objects
  const portfolioData = {
    currentValue,
    initialInvestment,
    oneDayData,
    oneWeekData,
    oneMonthData,
    totalReturnData,
  };

  return (
    <Box
      sx={{
        p: 0.5,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        mb: 3,
      }}
      className="h-auto"
    >
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{ flex: 1 }}
        >
          {/* Current Value */}
          <Typography
            variant="h5"
            sx={{
              color: currentTheme.accent.primary,
              fontWeight: 600,
              letterSpacing: "-0.5px",
            }}
          >
            {formatAmount(currentValue)}
          </Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={1}
            sx={{ mt: 1 }}
          >
            {/* Initial Investment */}
            <Box sx={{ mt: 0.5, mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Initial Investment
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: currentTheme.text.primary,
                  fontWeight: 500,
                }}
              >
                {formatAmount(initialInvestment)}
              </Typography>
            </Box>
            {/* Total Return */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: currentTheme.text.secondary,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.25,
                }}
              >
                Total Return
                {totalReturnData.isPositive ? (
                  <TrendingUpIcon
                    sx={{
                      color: "success.main",
                      fontSize: "0.875rem",
                    }}
                  />
                ) : (
                  <TrendingDownIcon
                    sx={{
                      color: "error.main",
                      fontSize: "0.875rem",
                    }}
                  />
                )}
                <Typography
                  variant="caption"
                  color={
                    totalReturnData.isPositive ? "success.main" : "error.main"
                  }
                >
                  {totalReturnData.formattedPercentage.toFixed(2)}%
                </Typography>
              </Typography>

              <Typography
                variant="subtitle1"
                color={
                  totalReturnData.isPositive ? "success.main" : "error.main"
                }
                sx={{ justifySelf: "right" }}
              >
                {totalReturnData.isPositive ? "+" : "-"}
                {formatAmount(totalReturnData.formattedChange, true)}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ color: currentTheme.accent.primary, marginTop: 2 }}
          >
            {/* 1D Change */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: currentTheme.text.secondary,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.25,
                }}
              >
                1D
                {oneDayData.isPositive ? (
                  <TrendingUpIcon
                    sx={{
                      color:
                        oneDayData.change >= 0 ? "success.main" : "error.main",
                      fontSize: "0.875rem",
                    }}
                  />
                ) : (
                  <TrendingDownIcon
                    sx={{
                      color:
                        oneDayData.change >= 0 ? "success.main" : "error.main",
                      fontSize: "0.875rem",
                    }}
                  />
                )}
                <Typography
                  variant="caption"
                  color={oneDayData.change >= 0 ? "success.main" : "error.main"}
                >
                  {oneDayData.formattedPercentage}%
                </Typography>
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {oneDayData.change >= 0 ? "+" : "-"}
                {formatAmount(oneDayData.formattedChange, true)}
              </Typography>
            </Box>

            {/* 1W Change */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: currentTheme.text.secondary,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.25,
                }}
              >
                1W
                {oneWeekData.isPositive ? (
                  <TrendingUpIcon
                    sx={{
                      color:
                        oneWeekData.change >= 0 ? "success.main" : "error.main",
                      fontSize: "0.875rem",
                    }}
                  />
                ) : (
                  <TrendingDownIcon
                    sx={{
                      color:
                        oneWeekData.change >= 0 ? "success.main" : "error.main",
                      fontSize: "0.875rem",
                    }}
                  />
                )}
                <Typography
                  variant="caption"
                  color={
                    oneWeekData.change >= 0 ? "success.main" : "error.main"
                  }
                >
                  {oneWeekData.formattedPercentage}%
                </Typography>
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {oneWeekData.change >= 0 ? "+" : "-"}
                {formatAmount(oneWeekData.formattedChange, true)}
              </Typography>
            </Box>

            {/* 1M Change */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: currentTheme.text.secondary,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.25,
                }}
              >
                1M
                {oneMonthData.isPositive ? (
                  <TrendingUpIcon
                    sx={{
                      color:
                        oneMonthData.change >= 0
                          ? "success.main"
                          : "error.main",
                      fontSize: "0.875rem",
                    }}
                  />
                ) : (
                  <TrendingDownIcon
                    sx={{
                      color:
                        oneMonthData.change >= 0
                          ? "success.main"
                          : "error.main",
                      fontSize: "0.875rem",
                    }}
                  />
                )}
                <Typography
                  variant="caption"
                  color={
                    oneMonthData.change >= 0 ? "success.main" : "error.main"
                  }
                >
                  {oneMonthData.formattedPercentage}%
                </Typography>
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {oneMonthData.change >= 0 ? "+" : "-"}
                {formatAmount(oneMonthData.formattedChange, true)}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default PortfolioValue;
