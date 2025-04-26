import React from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  useStopLosses,
  useDeleteStopLoss,
  useCreateStopLoss,
  useUpdateStopLoss,
} from "../api/queries/useStopLosses";
import TableView, { ColumnConfig } from "../components/common/TableView";
import { StopLoss, StopLossType, StopLossDTO } from "../types/api";
import {
  Button,
  Typography,
  Box,
  Drawer,
  IconButton,
  Stack,
} from "@mui/material";
import StopLossForm from "../components/StopLossForm";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { showToast } from "../utils/toast";
// import JournalIndicator from "../components/JournalIndicator";

const STOP_LOSS_TABLE_HEADERS: Array<ColumnConfig> = [
  {
    label: "Type",
    key: "type",
    render: (value: StopLossType, row: StopLoss) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography>
          {value === StopLossType.ABSOLUTE ? "Absolute" : "Percentage"}
        </Typography>
      </Box>
    ),
  },
  {
    label: "Value",
    key: "value",
    render: (value: number, row: StopLoss) =>
      `${value}${row.type === StopLossType.PERCENTAGE ? "%" : " Rs."}`,
  },
  {
    label: "Quantity",
    key: "quantity",
  },
  {
    label: "Status",
    key: "status",
  },
  {
    label: "Created At",
    key: "createdAt",
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
];

const StopLossPage: React.FC = () => {
  const { stockSymbol } = useParams<{ stockSymbol: string }>();
  const location = useLocation();
  const { portfolioStockId } = location.state || {};
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedStopLoss, setSelectedStopLoss] =
    React.useState<StopLoss | null>(null);

  const { data: stopLosses, isLoading } = useStopLosses(portfolioStockId);
  const deleteStopLoss = useDeleteStopLoss(portfolioStockId);
  const createStopLoss = useCreateStopLoss(portfolioStockId);
  const updateStopLoss = useUpdateStopLoss(
    selectedStopLoss?.id || 0,
    portfolioStockId
  );

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedStopLoss(null);
  };

  const handleStopLossSubmit = async (data: StopLossDTO) => {
    try {
      if (selectedStopLoss) {
        await updateStopLoss.mutateAsync(data);
        showToast.success("Stop loss updated successfully");
      } else {
        await createStopLoss.mutateAsync(data);
        showToast.success("Stop loss added successfully");
      }
      handleDrawerClose();
    } catch (error) {
      console.error("Failed to save stop loss:", error);
      showToast.error("Failed to save stop loss. Please try again.");
    }
  };

  const handleEdit = (stopLoss: StopLoss) => {
    setSelectedStopLoss(stopLoss);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this stop loss?")) {
      try {
        await deleteStopLoss.mutateAsync(id);
        showToast.success("Stop loss deleted successfully");
      } catch (error) {
        console.error("Failed to delete stop loss:", error);
        showToast.error("Failed to delete stop loss. Please try again.");
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const stopLossDrawer = (
    <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
      <Box sx={{ width: "400px", padding: "20px" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="20px"
        >
          <Typography variant="h6">
            {selectedStopLoss ? "Edit Stop Loss" : "Add Stop Loss"}
          </Typography>
          <IconButton onClick={handleDrawerClose} edge="end" aria-label="close">
            <CloseIcon />
          </IconButton>
        </Stack>
        <StopLossForm
          initialData={selectedStopLoss || undefined}
          onSubmit={handleStopLossSubmit}
          onCancel={handleDrawerClose}
          maxQuantity={100} // TODO: Get this from the portfolio stock
        />
      </Box>
    </Drawer>
  );

  return (
    <Box p={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={3}
      >
        <Typography variant="h4">Stop Losses for {stockSymbol}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsDrawerOpen(true)}
        >
          Add Stop Loss
        </Button>
      </Stack>

      <TableView
        columns={STOP_LOSS_TABLE_HEADERS}
        tableData={stopLosses || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showActions={true}
      />

      {stopLossDrawer}
    </Box>
  );
};

export default StopLossPage;
