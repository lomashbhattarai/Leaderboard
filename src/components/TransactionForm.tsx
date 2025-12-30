import React from "react";
import {
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { StockTransaction, StockTransactionDTO } from "../types/api";
import { TransactionType } from "../types/api";
import { showToast } from "../utils/toast";

interface TransactionFormProps {
  initialData?: Partial<StockTransaction>;
  portfolioStockId: number;
  currentHoldings?: number;
  onSubmit: (data: StockTransactionDTO) => void;
  onCancel: () => void;
}

type FormData = Omit<StockTransactionDTO, "portfolioStockId">;

const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  portfolioStockId,
  currentHoldings = 0,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState<Partial<FormData>>({
    transactionType: (initialData?.transactionType ||
      TransactionType.BUY) as TransactionType,
    quantity: initialData?.quantity,
    price: initialData?.price,
    transactionDate: initialData?.transactionDate || new Date().toISOString(),
    notes: initialData?.notes || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (value: any) => {
    setFormData((prev) => ({
      ...prev,
      transactionDate: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.transactionType || !formData.quantity || !formData.price) {
      showToast.error("Please fill in all required fields");
      return;
    }

    // Validate SELL quantity
    if (
      formData.transactionType === TransactionType.SELL &&
      formData.quantity > currentHoldings
    ) {
      showToast.error(
        `Cannot sell ${formData.quantity} shares. Only ${currentHoldings} available.`
      );
      return;
    }

    const transactionData: StockTransactionDTO = {
      portfolioStockId,
      transactionType: formData.transactionType as TransactionType,
      quantity: formData.quantity,
      price: formData.price,
      transactionDate: formData.transactionDate!,
      notes: formData.notes,
    };

    onSubmit(transactionData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <FormControl fullWidth required>
          <InputLabel>Transaction Type</InputLabel>
          <Select
            name="transactionType"
            value={formData.transactionType || TransactionType.BUY}
            onChange={handleSelectChange}
            label="Transaction Type"
          >
            <MenuItem value={TransactionType.BUY}>BUY</MenuItem>
            <MenuItem value={TransactionType.SELL}>SELL</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          required
          value={formData.quantity || ""}
          onChange={handleChange}
          inputProps={{ min: 1 }}
        />

        <TextField
          label="Price per Share"
          name="price"
          type="number"
          required
          value={formData.price || ""}
          onChange={handleChange}
          inputProps={{ min: 0, step: 0.01 }}
        />

        <DatePicker
          label="Transaction Date"
          value={
            formData.transactionDate
              ? new Date(formData.transactionDate)
              : new Date()
          }
          onChange={handleDateChange}
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
            },
          }}
        />

        <TextField
          label="Notes (Optional)"
          name="notes"
          multiline
          rows={3}
          value={formData.notes || ""}
          onChange={handleChange}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {initialData ? "Update" : "Add"} Transaction
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default TransactionForm;
