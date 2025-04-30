import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useWatchListContext } from "../contexts/WatchListContext";
import { formatPerformance } from "../pages/Leaderboard";
import { showToast } from "../utils/toast";
import TableView from "./common/TableView";
import { ColumnConfig } from "./common/TableView";

const WatchListTable: React.FC = () => {
  const { watchList, isLoading, removeFromWatchList } = useWatchListContext();

  const handleRemoveFromWatchList = async (id: number) => {
    try {
      await removeFromWatchList(id);
      showToast.success("Removed from watch list! 👋");
    } catch (error) {
      showToast.error("Failed to remove from watch list");
    }
  };

  const columns: ColumnConfig[] = [
    {
      label: "Symbol",
      key: "symbol",
      render: (_, row) => <Box>{row.symbol || "-"}</Box>,
    },
    {
      label: "Name",
      key: "name",
      minWidth: 300,
      render: (_, row) => (
        <Tooltip title={row.name || "-"}>
          <Box
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "300px",
              width: "100%",
              display: "block",
            }}
          >
            {row.name || "-"}
          </Box>
        </Tooltip>
      ),
    },
    {
      label: "Latest Price",
      key: "latestPrice",
      render: (_, row) => (row.latestPrice ? `Rs. ${row.latestPrice}` : "-"),
    },
    {
      label: "1 Day",
      key: "performance1D",
      render: (_, row) =>
        row.performance1D ? formatPerformance(row.performance1D) : "-",
    },
    {
      label: "1 Week",
      key: "performance1W",
      render: (_, row) =>
        row.performance1W ? formatPerformance(row.performance1W) : "-",
    },
    {
      label: "1 Month",
      key: "performance1M",
      render: (_, row) =>
        row.performance1M ? formatPerformance(row.performance1M) : "-",
    },
    {
      label: "Actions",
      key: "actions",
      render: (_, row) => (
        <Tooltip title="Remove from watch list">
          <IconButton
            size="small"
            onClick={() => handleRemoveFromWatchList(row.id)}
            sx={{
              color: "error.main",
              "&:hover": { backgroundColor: "error.lighter" },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  if (isLoading) {
    return <Typography>Loading watch list...</Typography>;
  }

  if (!watchList?.length) {
    return (
      <Box sx={{ textAlign: "center", py: 2 }}>
        <Typography color="text.secondary">
          Your watch list is empty. Add stocks to track them here!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="body1"
        component="h1"
        sx={{ fontWeight: "bold", mb: 0.5 }}
      >
        Your Watch List
      </Typography>
      <TableView columns={columns} tableData={watchList} isCompact />
    </Box>
  );
};

export default WatchListTable;
