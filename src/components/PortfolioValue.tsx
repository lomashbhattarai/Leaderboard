import React from "react";
import { Portfolio } from "../types/api";
import { useTheme } from "../contexts/ThemeContext";
import { getCommonStyles } from "../themes/commonComponents";
import AmountSummary from "./common/AmountSummary";
import { Stack, Typography, Box, Paper } from "@mui/material";
import { formatPerformance } from "../pages/Leaderboard";
import { formatAmount } from "../utils/helper";

interface PortfolioValueProps {
  portfolio?: Portfolio;
}

const PortfolioValue: React.FC<PortfolioValueProps> = ({ portfolio }) => {
  const { currentTheme } = useTheme();
  const styles = getCommonStyles(currentTheme);

  return (
    <Paper
      sx={{
        p: 3,
        ...styles.paper,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
      className="h-[130px]"
    >
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{ flex: 0.6 }}
        >
          <Typography
            variant="h4"
            sx={{
              color: currentTheme.accent.primary,
              fontWeight: 600,
              letterSpacing: "-0.5px",
            }}
          >
            {formatAmount(portfolio?.currentValue || 0)}
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ color: currentTheme.accent.primary }}
          >
            <Box>
              <Typography variant="body2">
                {formatPerformance(portfolio?.performance?.daily || 0)}
              </Typography>
              <Typography variant="body2">1 Day</Typography>
            </Box>
            <Box>
              <Typography variant="body2">
                {formatPerformance(portfolio?.performance?.weekly || 0)}
              </Typography>
              <Typography variant="body2">1 Week</Typography>
            </Box>
            <Box>
              <Typography variant="body2">
                {formatPerformance(portfolio?.performance?.monthly || 0)}
              </Typography>
              <Typography variant="body2">1 Month</Typography>
            </Box>
          </Stack>
        </Stack>
        <Box sx={{ flex: 0.4 }}>
          {/* <Typography variant="body2">Initial Value</Typography>
          <Typography variant="body2">0</Typography> */}
        </Box>
      </Stack>
    </Paper>
  );
};

export default PortfolioValue;
