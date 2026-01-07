import React, { useState } from "react";
import { Box, Typography, Stack, Drawer, Button } from "@mui/material";
import TableView, { ColumnConfig } from "../components/common/TableView";
import AmountSummary from "../components/common/AmountSummary";
import MaskedAmount from "../components/common/MaskedAmount";
import WealthEntryForm from "../components/WealthEntryForm";
import { WealthEntry } from "../types/wealth";
import { useWealth } from "../hooks/useWealth";
import WealthChart from "../components/WealthChart";
import WealthProjectionChart from "../components/WealthProjectionChart";

const WealthTracker: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WealthEntry | null>(null);

  const {
    wealthEntries,
    addWealthEntry,
    updateWealthEntry,
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
      render: (value: any) => <MaskedAmount value={value} />,
    },
  ];

  const handleAddWealth = async (newWealth: Omit<WealthEntry, "id">) => {
    try {
      await addWealthEntry(newWealth);
      setIsDrawerOpen(false);
      setEditingEntry(null);
    } catch (error) {
      // Error is handled in the hook, but we can add additional UI feedback here if needed
      console.error("Failed to add wealth entry:", error);
    }
  };

  const handleUpdateWealth = async (
    id: string,
    updatedWealth: Partial<Omit<WealthEntry, "id">>
  ) => {
    try {
      await updateWealthEntry(id, updatedWealth);
      setIsDrawerOpen(false);
      setEditingEntry(null);
    } catch (error) {
      // Error is handled in the hook, but we can add additional UI feedback here if needed
      console.error("Failed to update wealth entry:", error);
    }
  };

  const handleEditWealth = (entry: WealthEntry) => {
    setEditingEntry(entry);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingEntry(null);
  };

  const handleDeleteWealth = async (id: number | string) => {
    try {
      // TableView may pass number or string depending on row.id type
      // The hook handles both string and number IDs
      await deleteWealthEntry(id);
    } catch (error) {
      // Error is handled in the hook, but we can add additional UI feedback here if needed
      console.error("Failed to delete wealth entry:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems=""
        sx={{ mb: 3 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditingEntry(null);
            setIsDrawerOpen(true);
          }}
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
        isCompact
        tableData={wealthEntries}
        columns={columns}
        onEdit={handleEditWealth}
        onDelete={handleDeleteWealth}
        showActions={true}
      />

      <WealthProjectionChart amount={netWorth} />

      <Drawer anchor="right" open={isDrawerOpen} onClose={handleCloseDrawer}>
        <Box sx={{ width: 400 }}>
          <Typography variant="h6" sx={{ p: 3, pb: 0 }}>
            {editingEntry ? "Edit Asset" : "Add New Asset"}
          </Typography>
          <WealthEntryForm
            onAddWealth={handleAddWealth}
            onUpdateWealth={handleUpdateWealth}
            entry={editingEntry || undefined}
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default WealthTracker;
