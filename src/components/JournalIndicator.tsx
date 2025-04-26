import React from "react";
import { useJournals } from "../api/queries";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import BookIcon from "@mui/icons-material/Book";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Divider,
  Tooltip,
} from "@mui/material";
import { useTheme } from "../contexts/ThemeContext";
import { format } from "date-fns";

interface JournalIndicatorProps {
  portfolioStockId: number;
  stockSymbol: string;
}

const JournalIndicator: React.FC<JournalIndicatorProps> = ({
  portfolioStockId,
  stockSymbol,
}) => {
  const { currentTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { data: journals } = useJournals({
    portfolioStockId,
    journalType: "stock",
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!journals?.length) return null;

  return (
    <>
      <Tooltip title={`Journal Entry for ${stockSymbol}`} placement="top">
        <BookIcon
          className="cursor-pointer"
          onClick={handleOpenModal}
          fontSize="small"
          sx={{ color: currentTheme.accent.primary, width: 15, height: 15 }}
        />
      </Tooltip>

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: currentTheme.background.secondary,
            borderRadius: currentTheme.shape.borderRadius,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: currentTheme.text.primary,
            fontWeight: currentTheme.typography.fontWeights.heading,
          }}
        >
          Journals for {stockSymbol}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {journals.map((journal) => (
              <Box key={journal.id}>
                {/* <Typography
                  variant="subtitle1"
                  sx={{
                    color: currentTheme.text.primary,
                    fontWeight: currentTheme.typography.fontWeights.heading,
                  }}
                >
                  {journal.title}
                </Typography> */}
                <Typography
                  variant="caption"
                  sx={{ color: currentTheme.text.secondary }}
                >
                  {format(new Date(journal.createdAt), "MMM d, yyyy")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: currentTheme.text.primary,
                    mt: 1,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {journal.content}
                </Typography>
                {journal.tags && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: currentTheme.accent.primary,
                      display: "block",
                      mt: 1,
                    }}
                  >
                    Tags: {journal.tags}
                  </Typography>
                )}
                <Divider sx={{ my: 2 }} />
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            sx={{
              color: currentTheme.text.primary,
              "&:hover": {
                backgroundColor: currentTheme.background.primary,
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JournalIndicator;
