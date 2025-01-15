import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Transaction } from "../hooks/useEarningsCalculator";

interface RandomTransactionInputProps {
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
}

interface FormState {
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  amount: string;
  type: "salary" | "earning" | "expense";
}

const RandomTransactionInput: React.FC<RandomTransactionInputProps> = ({
  onAddTransaction,
}) => {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    startDate: null,
    endDate: null,
    amount: "",
    type: "salary",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formState.startDate &&
      formState.endDate &&
      formState.amount &&
      formState.name
    ) {
      onAddTransaction({
        name: formState.name,
        startDate: formState.startDate,
        endDate: formState.endDate,
        amount: parseFloat(formState.amount),
        type: formState.type,
        description: "",
        sn: 0,
      });
      setFormState((prev) => ({
        ...prev,
        name: "",
        startDate: formState.endDate,
        endDate: null,
        amount: "",
      }));
    }
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (
    field: "startDate" | "endDate",
    value: Date | null
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-4">
      <RadioGroup
        row
        name="type"
        value={formState.type}
        onChange={handleOnChange}
      >
        <FormControlLabel value="salary" control={<Radio />} label="Salary" />
        <FormControlLabel
          value="earning"
          control={<Radio />}
          label="One-time Earning"
        />
        <FormControlLabel
          value="expense"
          control={<Radio />}
          label="One-time Expense"
        />
      </RadioGroup>
      <TextField
        label="Transaction Name"
        name="name"
        value={formState.name}
        onChange={handleOnChange}
        fullWidth
      />
      <DatePicker
        label={formState.type === "salary" ? "Start Date" : "Transaction Date"}
        value={formState.startDate}
        onChange={(newDate) => handleDateChange("startDate", newDate)}
      />
      <DatePicker
        label={formState.type === "salary" ? "End Date" : "Transaction Date"}
        value={formState.endDate}
        onChange={(newDate) => handleDateChange("endDate", newDate)}
      />
      <TextField
        label={
          formState.type === "salary" ? "Salary Amount" : "Transaction Amount"
        }
        type="number"
        name="amount"
        value={formState.amount}
        onChange={handleOnChange}
        fullWidth
      />

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Add {formState.type === "salary" ? "Salary" : "Transaction"}
      </Button>
    </Box>
  );
};

export default RandomTransactionInput;
