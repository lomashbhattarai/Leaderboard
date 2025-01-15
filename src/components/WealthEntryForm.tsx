import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { WealthEntry } from "../types/wealth";

interface WealthEntryFormProps {
  onAddWealth: (wealth: Omit<WealthEntry, "id">) => void;
}

interface FormState {
  name: string;
  assetType: string;
  description: string;
  amount: string;
}

const WealthEntryForm: React.FC<WealthEntryFormProps> = ({ onAddWealth }) => {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    assetType: "Cash",
    description: "",
    amount: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.name && formState.amount) {
      onAddWealth({
        name: formState.name,
        assetType: formState.assetType,
        description: formState.description,
        amount: parseFloat(formState.amount),
      });
      setFormState({
        name: "",
        assetType: "Cash",
        description: "",
        amount: "",
      });
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

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <RadioGroup
        row
        name="assetType"
        value={formState.assetType}
        onChange={handleOnChange}
        sx={{ mb: 2 }}
      >
        <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
        <FormControlLabel value="Stocks" control={<Radio />} label="Stocks" />
        <FormControlLabel
          value="Real Estate"
          control={<Radio />}
          label="Real Estate"
        />
        <FormControlLabel value="Other" control={<Radio />} label="Other" />
      </RadioGroup>

      <TextField
        label="Asset Name"
        name="name"
        value={formState.name}
        onChange={handleOnChange}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Description"
        name="description"
        value={formState.description}
        onChange={handleOnChange}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Current Amount"
        type="number"
        name="amount"
        value={formState.amount}
        onChange={handleOnChange}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Add Asset
      </Button>
    </Box>
  );
};

export default WealthEntryForm;
