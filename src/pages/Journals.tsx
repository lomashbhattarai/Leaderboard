import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Drawer,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { useTheme } from "../contexts/ThemeContext";
import JournalForm from "../components/JournalForm";
import {
  useJournals,
  useCreateJournal,
  useUpdateJournal,
  useDeleteJournal,
} from "../api/queries";
import { showToast } from "../utils/toast";
import type { Journal, JournalDTO } from "../types/api";

const Journals: React.FC = () => {
  const { currentTheme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedJournal, setSelectedJournal] = React.useState<Journal | null>(
    null
  );

  const { data: journals = [] } = useJournals();
  const createJournal = useCreateJournal();
  const updateJournal = useUpdateJournal();
  const deleteJournal = useDeleteJournal();

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
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" sx={{ color: currentTheme.text.primary }}>
            My Journals
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsDrawerOpen(true)}
            sx={{
              backgroundColor: currentTheme.accent.primary,
              "&:hover": {
                backgroundColor: currentTheme.accent.secondary,
              },
            }}
          >
            Add Journal
          </Button>
        </Stack>

        <Stack spacing={3}>
          {journals.map((journal) => (
            <Box
              key={journal.id}
              sx={{
                p: 3,
                borderRadius: currentTheme.shape.borderRadius,
                bgcolor: currentTheme.background.secondary,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={2}
              >
                <Typography
                  variant="h6"
                  sx={{ color: currentTheme.text.primary }}
                >
                  {journal.title}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEdit(journal)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(journal.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
              <Typography
                variant="body1"
                sx={{ color: currentTheme.text.secondary, mb: 2 }}
              >
                {journal.content}
              </Typography>
              {journal.tags && (
                <Typography
                  variant="caption"
                  sx={{ color: currentTheme.text.secondary }}
                >
                  Tags: {journal.tags}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>

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
          />
        </Drawer>
      </Container>
    </Box>
  );
};

export default Journals;
