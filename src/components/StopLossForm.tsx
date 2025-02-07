import React from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import type { StopLoss, StopLossDTO } from "../types/api";
import { StopLossType } from "../types/api";

interface StopLossFormProps {
  initialData?: StopLoss;
  onSubmit: (data: StopLossDTO) => void;
  onCancel: () => void;
  maxQuantity: number;
}

const StopLossForm: React.FC<StopLossFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  maxQuantity,
}) => {
  const [formData, setFormData] = React.useState<Partial<StopLossDTO>>({
    type: initialData?.type || StopLossType.ABSOLUTE,
    value: initialData?.value || 0,
    quantity: initialData?.quantity || maxQuantity,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | null,
    name?: string,
    value?: any
  ) => {
    if (e) {
      // Handle standard input changes
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "value" || name === "quantity" ? Number(value) : value,
      }));
    } else if (name && value !== undefined) {
      // Handle Select changes
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.type &&
      formData.value !== undefined &&
      formData.quantity !== undefined
    ) {
      // Validate quantity
      if (formData.quantity > maxQuantity) {
        alert(`Maximum quantity allowed is ${maxQuantity}`);
        return;
      }
      if (formData.quantity <= 0) {
        alert("Quantity must be greater than 0");
        return;
      }

      // Validate value
      if (formData.value < 0) {
        alert("Value must be positive");
        return;
      }

      onSubmit(formData as StopLossDTO);
    } else {
      alert("Please fill all required fields");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <FormControl>
          <InputLabel>Stop Loss Type</InputLabel>
          <Select
            name="type"
            value={formData.type || ""}
            label="Stop Loss Type"
            onChange={(e) => handleChange(null, "type", e.target.value)}
          >
            <MenuItem value={StopLossType.ABSOLUTE}>Absolute Value</MenuItem>
            <MenuItem value={StopLossType.PERCENTAGE}>Percentage</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Stop Loss Value"
          name="value"
          type="number"
          required
          value={formData.value || ""}
          onChange={handleChange}
          helperText={
            formData.type === StopLossType.ABSOLUTE
              ? "Enter price in Rs."
              : "Enter percentage value"
          }
        />

        <TextField
          label="Quantity to Sell"
          name="quantity"
          type="number"
          required
          value={formData.quantity || ""}
          onChange={handleChange}
          helperText={`Maximum: ${maxQuantity} units`}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? "Update" : "Create"} Stop Loss
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default StopLossForm;
