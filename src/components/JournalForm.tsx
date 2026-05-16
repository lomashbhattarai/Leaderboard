import React from "react";
import { Button, Stack, Box, Chip, Typography } from "@mui/material";
import type { Journal, JournalDTO, StockWithPerformance } from "../types/api";
import { showToast } from "../utils/toast";
import { useTheme } from "../contexts/ThemeContext";

interface JournalFormProps {
  initialData?: Partial<Journal>;
  onSubmit: (data: JournalDTO) => void;
  portfolioStockId?: number;
  stopLossId?: number;
  stocks?: StockWithPerformance[];
}

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getDetectedSymbols = (content: string, stocks: StockWithPerformance[]) => {
  if (!content || stocks.length === 0) {
    return [];
  }

  const stockBySymbol = new Map(
    stocks.map((stock) => [stock.symbol.toUpperCase(), stock])
  );

  const symbols = Array.from(content.matchAll(/\b([A-Z][A-Z0-9]{1,11})(?=\s)/gi))
    .map((match) => match[1].toUpperCase())
    .filter((symbol, index, all) => all.indexOf(symbol) === index)
    .filter((symbol) => stockBySymbol.has(symbol));

  return symbols;
};

const renderHighlightedContent = (
  content: string,
  detectedSymbols: string[],
  highlightColor: string
) => {
  if (!content) {
    return null;
  }

  if (detectedSymbols.length === 0) {
    return content;
  }

  const regex = new RegExp(
    `\\b(${detectedSymbols.map(escapeRegex).join("|")})(?=\\s)`,
    "gi"
  );
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }

    parts.push(
      <Box
        key={`${match[0]}-${match.index}`}
        component="mark"
        sx={{
          px: 0,
          py: 0,
          borderRadius: "0.2rem",
          color: "inherit",
          backgroundColor: highlightColor,
          fontWeight: "inherit",
        }}
      >
        {match[0]}
      </Box>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts;
};

const JournalForm: React.FC<JournalFormProps> = ({
  initialData,
  onSubmit,
  portfolioStockId,
  stopLossId,
  stocks = [],
}) => {
  const { currentTheme } = useTheme();
  const [formData, setFormData] = React.useState<Partial<JournalDTO>>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    tags: initialData?.tags || "",
    journalType: initialData?.journalType || "general",
    portfolioStockId:
      portfolioStockId || (initialData?.portfolioStockId ?? undefined),
    stopLossId: stopLossId || (initialData?.stopLossId ?? undefined),
  });

  const detectedSymbols = React.useMemo(
    () => getDetectedSymbols(formData.content || "", stocks),
    [formData.content, stocks]
  );

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
    if (!formData.content) {
      showToast.error("Please fill in all required fields");
      return;
    }

    onSubmit({
      ...(formData as JournalDTO),
      ...(detectedSymbols[0] ? { stockSymbol: detectedSymbols[0] } : {}),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {/* <TextField
          label="Title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          fullWidth
        /> */}

        <Box>
          <Typography
            component="label"
            htmlFor="journal-content"
            sx={{
              display: "block",
              mb: 0.75,
              color: currentTheme.text.secondary,
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            Content
          </Typography>
          <Box
            sx={{
              position: "relative",
              minHeight: 132,
              border: `1px solid ${currentTheme.border.default}`,
              borderRadius: "0.5rem",
              backgroundColor: currentTheme.surface.paper,
              "&:focus-within": {
                borderColor: currentTheme.accent.primary,
                boxShadow: `0 0 0 3px ${currentTheme.accent.soft}`,
              },
            }}
          >
            {!formData.content && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  p: 1.75,
                  color: currentTheme.text.secondary,
                  pointerEvents: "none",
                }}
              >
                Write a journal note...
              </Box>
            )}
            <Box
              aria-hidden="true"
              sx={{
                position: "absolute",
                inset: 0,
                p: 1.75,
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                color: currentTheme.text.primary,
                fontFamily: currentTheme.typography.fontFamily,
                fontSize: "1rem",
                lineHeight: 1.5,
                letterSpacing: 0,
                pointerEvents: "none",
              }}
            >
              {renderHighlightedContent(
                formData.content || "",
                detectedSymbols,
                currentTheme.accent.soft
              )}
            </Box>
            <Box
              id="journal-content"
              component="textarea"
              aria-label="Content"
              name="content"
              required
              value={formData.content || ""}
              onChange={handleChange}
              rows={5}
              sx={{
                position: "relative",
                zIndex: 1,
                display: "block",
                width: "100%",
                minHeight: 132,
                p: 1.75,
                border: 0,
                outline: 0,
                resize: "vertical",
                color: "transparent",
                caretColor: currentTheme.text.primary,
                backgroundColor: "transparent",
                fontFamily: currentTheme.typography.fontFamily,
                fontSize: "1rem",
                lineHeight: 1.5,
                letterSpacing: 0,
                WebkitTextFillColor: "transparent",
                "&::selection": {
                  backgroundColor: currentTheme.accent.soft,
                },
              }}
            />
          </Box>
          {detectedSymbols.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              {detectedSymbols.map((symbol) => (
                <Chip
                  key={symbol}
                  size="small"
                  label={symbol}
                  sx={{
                    height: 24,
                    borderRadius: "999px",
                    color: currentTheme.accent.primary,
                    backgroundColor: currentTheme.accent.soft,
                    fontWeight: 700,
                  }}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* <TextField
          label="Tags (comma separated)"
          name="tags"
          value={formData.tags || ""}
          onChange={handleChange}
          fullWidth
        /> */}

        {/* <TextField
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
        </TextField> */}

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
