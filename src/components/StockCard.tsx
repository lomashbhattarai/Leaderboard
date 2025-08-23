import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import AddToWatchListHover from "./AddToWatchListHover";
import StockSymbolLink from "./common/StockSymbolLink";
import { formatAmount } from "../utils/helper";
import { formatPerformance } from "../pages/Leaderboard";
import type { StockWithPerformance } from "../types/api";

interface StockCardProps {
  row: StockWithPerformance;
}

const StockCard: React.FC<StockCardProps> = ({ row }) => {
  return (
    <Box>
      <Stack spacing={1}>
        <AddToWatchListHover stockId={row.id} alwaysShow>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              <StockSymbolLink symbol={row.symbol} />
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {row.name}
            </Typography>
          </Box>
        </AddToWatchListHover>
        <Stack direction="row" justifyContent="space-between" textAlign="center">
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {row.latestPrice ? formatAmount(row.latestPrice, true) : "-"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Latest Price
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {row.performance1D !== null ? formatPerformance(row.performance1D) : "-"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 Day
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {row.performance1W !== null ? formatPerformance(row.performance1W) : "-"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 Week
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {row.performance1M !== null ? formatPerformance(row.performance1M) : "-"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 Month
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default StockCard;
