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
  Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { StockTransactionWithStockDTO } from "../types/api";
import { TransactionType } from "../types/api";
import { useStockContext } from "../contexts/StockContext";
import { showToast } from "../utils/toast";

interface AddTransactionFormProps {
  portfolioId: number;
  onSubmit: (data: StockTransactionWithStockDTO) => void;
  onCancel: () => void;
}

type FormData = Omit<
  StockTransactionWithStockDTO,
  "portfolioId" | "stockId"
> & {
  stockSymbol: string;
};

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  portfolioId,
  onSubmit,
  onCancel,
}) => {
  const { stockMap } = useStockContext();
  const [formData, setFormData] = React.useState<Partial<FormData>>({
    stockSymbol: "",
    transactionType: TransactionType.BUY,
    quantity: undefined,
    price: undefined,
    transactionDate: new Date().toISOString(),
    notes: "",
  });

  const stockSymbols = Object.keys(stockMap).sort();

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

  const handleStockChange = (
    event: React.SyntheticEvent,
    value: string | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      stockSymbol: value || "",
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

    if (
      !formData.stockSymbol ||
      !formData.transactionType ||
      !formData.quantity ||
      !formData.price
    ) {
      showToast.error("Please fill in all required fields");
      return;
    }

    const stockId = stockMap[formData.stockSymbol];
    if (!stockId) {
      showToast.error("Invalid stock symbol");
      return;
    }

    const transactionData: StockTransactionWithStockDTO = {
      portfolioId,
      stockId,
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
        <Autocomplete
          options={stockSymbols}
          value={formData.stockSymbol || null}
          onChange={handleStockChange}
          renderInput={(params) => (
            <TextField {...params} label="Stock Symbol" required />
          )}
          freeSolo={false}
        />

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
            Add Transaction
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default AddTransactionForm;
