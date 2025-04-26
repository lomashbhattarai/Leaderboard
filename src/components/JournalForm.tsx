import React from "react";
import { TextField, Button, Stack, MenuItem, Box } from "@mui/material";
import type { Journal, JournalDTO } from "../types/api";
import { showToast } from "../utils/toast";

interface JournalFormProps {
  initialData?: Partial<Journal>;
  onSubmit: (data: JournalDTO) => void;
  portfolioStockId?: number;
  stopLossId?: number;
}

const JournalForm: React.FC<JournalFormProps> = ({
  initialData,
  onSubmit,
  portfolioStockId,
  stopLossId,
}) => {
  const [formData, setFormData] = React.useState<Partial<JournalDTO>>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    tags: initialData?.tags || "",
    journalType: initialData?.journalType || "general",
    portfolioStockId:
      portfolioStockId || (initialData?.portfolioStockId ?? undefined),
    stopLossId: stopLossId || (initialData?.stopLossId ?? undefined),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.journalType) {
      showToast.error("Please fill in all required fields");
      return;
    }

    onSubmit(formData as JournalDTO);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          label="Title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Content"
          name="content"
          required
          multiline
          rows={4}
          value={formData.content}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Tags (comma separated)"
          name="tags"
          value={formData.tags || ""}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          select
          label="Journal Type"
          name="journalType"
          required
          value={formData.journalType}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="general">General</MenuItem>
          <MenuItem value="stock">Stock</MenuItem>
          <MenuItem value="stop_loss">Stop Loss</MenuItem>
        </TextField>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? "Update Journal" : "Create Journal"}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default JournalForm;
