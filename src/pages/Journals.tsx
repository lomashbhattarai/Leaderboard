import React from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Drawer,
  IconButton,
  Fab,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Divider,
  Link,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MenuBook as MenuBookIcon,
} from "@mui/icons-material";
import { useTheme } from "../contexts/ThemeContext";
import JournalForm from "../components/JournalForm";
import {
  useJournals,
  useCreateJournal,
  useUpdateJournal,
  useDeleteJournal,
  useStocksWithPerformance,
} from "../api/queries";
import { showToast } from "../utils/toast";
import { formatAmount } from "../utils/helper";
import type { Journal, JournalDTO, StockWithPerformance } from "../types/api";

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const stockDetailHref = (symbol: string) =>
  `${window.location.origin}${window.location.pathname}#/stock/${symbol}`;

const findSymbolsInText = (
  content: string,
  stocks: StockWithPerformance[]
) => {
  const stockBySymbol = new Map(
    stocks.map((stock) => [stock.symbol.toUpperCase(), stock])
  );
  const words = content.match(/\b[A-Z][A-Z0-9]{1,11}\b/gi) || [];

  return words
    .map((word) => word.toUpperCase())
    .filter((symbol, index, all) => all.indexOf(symbol) === index)
    .filter((symbol) => stockBySymbol.has(symbol));
};

const StockTooltipCard = ({
  stock,
}: {
  stock?: StockWithPerformance;
}) => {
  if (!stock) {
    return null;
  }

  const toFiniteNumber = (value: unknown) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
  };

  const latestPrice = toFiniteNumber(stock.latestPrice);
  const performance1D = toFiniteNumber(stock.performance1D);
  const performance1W = toFiniteNumber(stock.performance1W);
  const performance1M = toFiniteNumber(stock.performance1M);
  const performanceColor =
    performance1D !== null && performance1D > 0
      ? "text-app-positive"
      : performance1D !== null && performance1D < 0
      ? "text-app-negative"
      : "text-app-muted";

  return (
    <Box sx={{ minWidth: 220, p: 0.25 }}>
      <Typography sx={{ fontSize: "0.75rem", opacity: 0.72 }}>
        {stock.name}
      </Typography>
      <Typography sx={{ fontWeight: 800, fontSize: "1rem", lineHeight: 1.2 }}>
        {stock.symbol}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Stack spacing={0.75}>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Typography sx={{ fontSize: "0.75rem", opacity: 0.72 }}>
            Current price
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", fontWeight: 700 }}>
            {latestPrice !== null ? formatAmount(latestPrice) : "N/A"}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Typography sx={{ fontSize: "0.75rem", opacity: 0.72 }}>
            1D move
          </Typography>
          <Typography
            className={performanceColor}
            sx={{ fontSize: "0.8rem", fontWeight: 800 }}
          >
            {performance1D !== null
              ? `${performance1D > 0 ? "+" : ""}${performance1D.toFixed(2)}%`
              : "N/A"}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Typography sx={{ fontSize: "0.75rem", opacity: 0.72 }}>
            1W / 1M
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", fontWeight: 700 }}>
            {performance1W !== null && performance1M !== null
              ? `${performance1W.toFixed(2)}% / ${performance1M.toFixed(2)}%`
              : "N/A"}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

const JournalContent = ({
  content,
  stocks,
}: {
  content: string;
  stocks: StockWithPerformance[];
}) => {
  const symbols = findSymbolsInText(content, stocks);

  if (symbols.length === 0) {
    return <>{content}</>;
  }

  const stocksBySymbol = new Map(
    stocks.map((stock) => [stock.symbol.toUpperCase(), stock])
  );
  const regex = new RegExp(
    `\\b(${symbols.map(escapeRegex).join("|")})\\b`,
    "gi"
  );

  return (
    <>
      {content.split(regex).map((part, index) => {
        const symbol = part.toUpperCase();
        const stock = stocksBySymbol.get(symbol);

        if (!stock) {
          return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
        }

        return (
          <Tooltip
            key={`${part}-${index}`}
            arrow
            enterDelay={250}
            title={<StockTooltipCard stock={stock} />}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "background.paper",
                  color: "text.primary",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: 4,
                  p: 1,
                },
              },
              arrow: {
                sx: {
                  color: "background.paper",
                },
              },
            }}
          >
            <Link
              href={stockDetailHref(symbol)}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              onClick={(event) => event.stopPropagation()}
              sx={{
                display: "inline",
                px: 0,
                py: 0,
                mx: 0,
                fontWeight: 800,
                color: "var(--app-accent)",
                backgroundColor: "transparent",
                border: 0,
                transition: "color 160ms ease",
                "&:hover": {
                  color: "var(--app-info)",
                },
              }}
            >
              {part}
            </Link>
          </Tooltip>
        );
      })}
    </>
  );
};

const Journals: React.FC = () => {
  const { currentTheme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedJournal, setSelectedJournal] = React.useState<Journal | null>(
    null
  );
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  const { data: journals = [] } = useJournals();
  const createJournal = useCreateJournal();
  const updateJournal = useUpdateJournal();
  const deleteJournal = useDeleteJournal();
  const { data: stocks = [] } = useStocksWithPerformance();

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedJournal(null);
  };

  const handleJournalSubmit = async (data: JournalDTO) => {
    try {
      data.journalType = "general";
      data.title = data.title || " ";
      if (selectedJournal) {
        await updateJournal.mutateAsync({ id: selectedJournal.id, data });
        showToast.success("Journal updated successfully");
      } else {
        await createJournal.mutateAsync(data);
        showToast.success("Journal created successfully");
      }
      handleDrawerClose();
    } catch (error) {
      console.error("Failed to save journal:", error);
      showToast.error("Failed to save journal. Please try again.");
    }
  };

  const handleEdit = (journal: Journal) => {
    setSelectedJournal(journal);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this journal?")) {
      try {
        await deleteJournal.mutateAsync(id);
        showToast.success("Journal deleted successfully");
      } catch (error) {
        console.error("Failed to delete journal:", error);
        showToast.error("Failed to delete journal. Please try again.");
      }
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: 400,
            p: 2.5,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: currentTheme.typography.fontWeights.heading,
              color: currentTheme.text.primary,
            }}
          >
            {selectedJournal ? "Edit Journal" : "Add Journal"}
          </Typography>
          <IconButton
            onClick={handleDrawerClose}
            edge="end"
            aria-label="close"
            sx={{ color: currentTheme.text.primary }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <JournalForm
          initialData={selectedJournal || undefined}
          onSubmit={handleJournalSubmit}
          stocks={stocks}
        />
      </Drawer>
      <div className="min-h-screen py-12">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-6">
            <h1 className="text-2xl font-serif font-medium text-app-text mb-2 flex items-center justify-center">
              <MenuBookIcon className="mr-2" fontSize="inherit" />
              Trading Journal
            </h1>
            <p className="text-sm text-app-muted font-light">
              Your reflections and insights on the market
            </p>
          </header>
          <div className="space-y-4" data-testid="journal-list">
            {journals.map((journal) => (
              <Card
                data-testid="journal-row"
                key={journal.id}
                className="overflow-hidden border border-app-border shadow-sm hover:shadow-md transition-shadow duration-300"
                sx={{
                  borderRadius: "0.75rem",
                  backgroundColor: currentTheme.surface.paper,
                }}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <Typography
                      variant="subtitle2"
                      className="text-lg font-semibold text-app-text"
                    >
                      {journal.title || "Untitled"}
                    </Typography>

                    {journal.tags && (
                      <Chip
                        label={journal.tags}
                        size="small"
                        sx={{
                          backgroundColor: currentTheme.accent.soft,
                          color: currentTheme.accent.primary,
                          fontWeight: 600,
                          fontSize: "0.625rem",
                          height: "1rem",
                          borderRadius: "9999px",
                        }}
                      />
                    )}
                  </div>

                  <Typography
                    variant="body2"
                    className="text-sm text-app-text leading-relaxed mb-2 max-w-prose"
                  >
                    <JournalContent
                      content={
                        expandedId === journal.id
                          ? journal.content
                          : journal.content.length > 200
                          ? `${journal.content.slice(0, 200)}...`
                          : journal.content
                      }
                      stocks={stocks}
                    />
                  </Typography>
                  {journal.content.length > 200 && (
                    <Button
                      size="small"
                      onClick={() =>
                        setExpandedId(
                          expandedId === journal.id ? null : journal.id
                        )
                      }
                    >
                      {expandedId === journal.id ? "Show Less" : "Read More"}
                    </Button>
                  )}

                  <div className="flex justify-end space-x-1 mt-2">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(journal)}
                      aria-label={`edit ${journal.title || "journal"}`}
                      sx={{ color: currentTheme.text.secondary }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(journal.id)}
                      aria-label={`delete ${journal.title || "journal"}`}
                      sx={{ color: currentTheme.text.secondary }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {journals.length === 0 && (
            <div className="text-center py-12">
              <Typography variant="body1" className="text-app-muted italic">
                No journal entries yet. Start documenting your trading journey.
              </Typography>
            </div>
          )}
        </div>
      </div>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setIsDrawerOpen(true)}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: currentTheme.accent.primary,
          "&:hover": { backgroundColor: currentTheme.accent.secondary },
        }}
      >
        <AddIcon />
      </Fab>
    </>
  );
};

export default Journals;
