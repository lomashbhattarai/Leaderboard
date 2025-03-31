import React from "react";
import { Portfolio } from "../types/api";
import { useTheme } from "../contexts/ThemeContext";
import { getCommonStyles } from "../themes/commonComponents";
import AmountSummary from "./common/AmountSummary";
import {
  Stack,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Current Value
              </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: currentTheme.typography.fontWeights.heading,
                  mb: 0.5,
                }}
              >
                {formatAmount(currentValue)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {totalReturnData.isPositive ? (
                  <TrendingUpIcon sx={{ color: "success.main" }} />
                ) : (
                  <TrendingDownIcon sx={{ color: "error.main" }} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: totalReturnData.isPositive
                      ? "success.main"
                      : "error.main",
                  }}
                >
                  {totalReturnData.formattedPercentage.toFixed(2)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Initial Investment
              </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: currentTheme.typography.fontWeights.heading,
                  mb: 0.5,
                  color: currentTheme.text.primary,
                }}
              >
                {formatAmount(initialInvestment)}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: totalReturnData.isPositive
                    ? "success.main"
                    : "error.main",
                }}
              >
                {totalReturnData.isPositive ? "+" : "-"}
                {formatAmount(totalReturnData.formattedChange, true)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Performance
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        1D
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            oneDayData.change >= 0
                              ? "success.main"
                              : "error.main",
                          fontWeight:
                            currentTheme.typography.fontWeights.button,
                        }}
                      >
                        {oneDayData.formattedPercentage}%
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          oneDayData.change >= 0
                            ? "success.main"
                            : "error.main",
                      }}
                    >
                      {oneDayData.change >= 0 ? "+" : "-"}
                      {formatAmount(oneDayData.formattedChange, true)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        1W
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            oneWeekData.change >= 0
                              ? "success.main"
                              : "error.main",
                          fontWeight:
                            currentTheme.typography.fontWeights.button,
                        }}
                      >
                        {oneWeekData.formattedPercentage}%
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          oneWeekData.change >= 0
                            ? "success.main"
                            : "error.main",
                      }}
                    >
                      {oneWeekData.change >= 0 ? "+" : "-"}
                      {formatAmount(oneWeekData.formattedChange, true)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        1M
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            oneMonthData.change >= 0
                              ? "success.main"
                              : "error.main",
                          fontWeight:
                            currentTheme.typography.fontWeights.button,
                        }}
                      >
                        {oneMonthData.formattedPercentage}%
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          oneMonthData.change >= 0
                            ? "success.main"
                            : "error.main",
                      }}
                    >
                      {oneMonthData.change >= 0 ? "+" : "-"}
                      {formatAmount(oneMonthData.formattedChange, true)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PortfolioValue;
