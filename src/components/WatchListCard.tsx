import React from "react";
import { Box, Stack, Typography, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StockLink from "./common/StockLink";
import { formatPerformance } from "../pages/Leaderboard";
import type { WatchListEntry } from "../types/api";

interface WatchListCardProps {
  row: WatchListEntry;
  onRemove: (id: number) => void;
}

const WatchListCard: React.FC<WatchListCardProps> = ({ row, onRemove }) => {
  return (
    <Box>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {row.symbol ? <StockLink symbol={row.symbol} /> : "-"}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {row.name || "-"}
            </Typography>
          </Box>
          <Tooltip title="Remove from watch list">
            <IconButton
              size="small"
              onClick={() => onRemove(row.id)}
              sx={{
                color: "error.main",
                "&:hover": { backgroundColor: "error.lighter" },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack direction="row" justifyContent="space-between" textAlign="center">
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {row.latestPrice ? `Rs. ${row.latestPrice}` : "-"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Latest Price
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {row.performance1D ? formatPerformance(row.performance1D) : "-"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 Day
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {row.performance1W ? formatPerformance(row.performance1W) : "-"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 Week
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {row.performance1M ? formatPerformance(row.performance1M) : "-"}
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

export default WatchListCard;
