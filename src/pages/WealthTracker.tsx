import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Drawer, Button } from "@mui/material";
import TableView, { ColumnConfig } from "../components/common/TableView";
import { formatAmount } from "../utils/helper";
import AmountSummary from "../components/common/AmountSummary";
import WealthEntryForm from "../components/WealthEntryForm";
import { WealthEntry } from "../types/wealth";
import { useWealth } from "../hooks/useWealth";
import WealthChart from "../components/WealthChart";

const WealthTracker: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    wealthEntries,
    addWealthEntry,
    netWorth,
    addMultipleWealthEntries,
    deleteWealthEntry,
  } = useWealth();

  // Column definitions for the wealth table
  const columns: ColumnConfig[] = [
    {
      label: "Name",
      key: "name",
    },
    {
      label: "Asset Type",
      key: "assetType",
    },
    {
      label: "Description",
      key: "description",
    },
    {
      label: "Current amount",
      key: "amount",
      render: (value: any) => formatAmount(value),
    },
  ];

  const handleAddWealth = (newWealth: Omit<WealthEntry, "id">) => {
    addWealthEntry(newWealth);
    setIsDrawerOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">Wealth Tracker</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsDrawerOpen(true)}
        >
          Add New Asset
        </Button>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{ mb: 3 }}
        alignItems="center"
      >
        <Box width={{ xs: "100%", md: "50%" }}>
          <AmountSummary label="Total Wealth" value={netWorth} />
        </Box>
        <Box width="100%">
          <WealthChart wealthEntries={wealthEntries} />
        </Box>
      </Stack>

      <TableView
        tableData={wealthEntries}
        columns={columns}
        onDeleteTransaction={deleteWealthEntry}
      />

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box sx={{ width: 400 }}>
          <Typography variant="h6" sx={{ p: 3, pb: 0 }}>
            Add New Asset
          </Typography>
          <WealthEntryForm onAddWealth={handleAddWealth} />
        </Box>
      </Drawer>
    </Box>
  );
};

export default WealthTracker;
