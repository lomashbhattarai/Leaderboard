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

  // Total investment performance (using dummy initial investment for now)
  const initialInvestment = portfolio?.initialInvestment || 1000000;
  const currentValue = portfolio?.currentValue || 0;
  const totalChange = currentValue - initialInvestment;
  const totalChangePercentage = (currentValue / initialInvestment - 1) * 100;
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
    <Paper
      sx={{
        p: 3,
        ...styles.paper,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
      className="h-auto"
    >
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{ flex: 1 }}
        >
          <Typography
            variant="h4"
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
            alignItems="center"
            sx={{ color: currentTheme.accent.primary }}
          >
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
                1D
                {oneDayData.isPositive ? (
                  <TrendingUpIcon
                    sx={{
                      color:
                        oneDayData.change >= 0 ? "success.main" : "error.main",
                      fontSize: "1rem",
                    }}
                  />
                ) : (
                  <TrendingDownIcon
                    sx={{
                      color:
                        oneDayData.change >= 0 ? "success.main" : "error.main",
                      fontSize: "1rem",
                    }}
                  />
                )}
                {/* add percentage */}
                <Typography
                  variant="body2"
                  color={oneDayData.change >= 0 ? "success.main" : "error.main"}
                >
                  {oneDayData.formattedPercentage}%
                </Typography>
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {/* add + or - symbol */}
                {oneDayData.change >= 0 ? "+" : "-"}
                {formatAmount(oneDayData.formattedChange, true)}
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
                1W
                {oneWeekData.isPositive ? (
                  <TrendingUpIcon
                    sx={{
                      color:
                        oneWeekData.change >= 0 ? "success.main" : "error.main",
                      fontSize: "1rem",
                    }}
                  />
                ) : (
                  <TrendingDownIcon
                    sx={{
                      color:
                        oneWeekData.change >= 0 ? "success.main" : "error.main",
                      fontSize: "1rem",
                    }}
                  />
                )}
                {/* add percentage */}
                <Typography
                  variant="body2"
                  color={
                    oneWeekData.change >= 0 ? "success.main" : "error.main"
                  }
                >
                  {oneWeekData.formattedPercentage}%
                </Typography>
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {/* add + or - symbol */}
                {oneWeekData.change >= 0 ? "+" : "-"}
                {formatAmount(oneWeekData.formattedChange, true)}
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
                1M
                {oneMonthData.isPositive ? (
                  <TrendingUpIcon
                    sx={{
                      color:
                        oneMonthData.change >= 0
                          ? "success.main"
                          : "error.main",
                      fontSize: "1rem",
                    }}
                  />
                ) : (
                  <TrendingDownIcon
                    sx={{
                      color:
                        oneMonthData.change >= 0
                          ? "success.main"
                          : "error.main",
                      fontSize: "1rem",
                    }}
                  />
                )}
                {/* add percentage */}
                <Typography
                  variant="body2"
                  color={
                    oneMonthData.change >= 0 ? "success.main" : "error.main"
                  }
                >
                  {oneMonthData.formattedPercentage}%
                </Typography>
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {/* add + or - symbol */}
                {oneMonthData.change >= 0 ? "+" : "-"}
                {formatAmount(oneMonthData.formattedChange, true)}
              </Typography>
            </Box>
            {/* add this back later after change the db model and adding in the api response */}
            <Box>
              {/* <Typography variant="body2" color="text.secondary">
                Initial Investment
              </Typography>
              <Typography variant="body1">
                {formatAmount(initialInvestment)}
              </Typography>
              <Typography
                variant="body2"
                color={
                  totalReturnData.change >= 0 ? "success.main" : "error.main"
                }
              >
                {totalReturnData.change >= 0 ? "+" : ""}
                {formatAmount(totalReturnData.formattedChange)}
              </Typography> */}
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default PortfolioValue;
