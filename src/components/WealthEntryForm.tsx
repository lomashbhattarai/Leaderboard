import React, { useState, useEffect } from "react";
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
  onUpdateWealth?: (
    id: string,
    wealth: Partial<Omit<WealthEntry, "id">>
  ) => void;
  entry?: WealthEntry;
}

interface FormState {
  name: string;
  assetType: string;
  description: string;
  amount: string;
}

const WealthEntryForm: React.FC<WealthEntryFormProps> = ({
  onAddWealth,
  onUpdateWealth,
  entry,
}) => {
  const isEditMode = !!entry;

  const [formState, setFormState] = useState<FormState>({
    name: entry?.name || "",
    assetType: entry?.assetType || "Cash",
    description: entry?.description || "",
    amount: entry?.amount?.toString() || "",
  });

  useEffect(() => {
    if (entry) {
      setFormState({
        name: entry.name || "",
        assetType: entry.assetType || "Cash",
        description: entry.description || "",
        amount: entry.amount?.toString() || "",
      });
    } else {
      setFormState({
        name: "",
        assetType: "Cash",
        description: "",
        amount: "",
      });
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.name && formState.amount) {
      const wealthData = {
        name: formState.name,
        assetType: formState.assetType,
        description: formState.description,
        amount: parseFloat(formState.amount),
      };

      if (isEditMode && entry && onUpdateWealth) {
        onUpdateWealth(entry.id, wealthData);
      } else {
        onAddWealth(wealthData);
        setFormState({
          name: "",
          assetType: "Cash",
          description: "",
          amount: "",
        });
      }
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
        {isEditMode ? "Update Asset" : "Add Asset"}
      </Button>
    </Box>
  );
};

export default WealthEntryForm;
