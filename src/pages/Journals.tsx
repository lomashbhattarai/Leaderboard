import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Drawer,
  IconButton,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
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
        />
      </Drawer>
      <div className="min-h-screen py-12">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-serif font-medium text-gray-900 mb-2">
              Trading Journal
            </h1>
            <p className="text-lg text-gray-600 font-light">
              Your reflections and insights on the market
            </p>
          </header>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsDrawerOpen(true)}
            sx={{
              backgroundColor: currentTheme.accent.primary,
              "&:hover": {
                backgroundColor: currentTheme.accent.secondary,
              },
              marginBottom: "1rem",
            }}
          >
            Add Journal
          </Button>

          <div className="space-y-6">
            {journals.map((journal) => (
              <Card
                key={journal.id}
                className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-300"
                sx={{
                  borderRadius: "0.75rem",
                  backgroundColor: "#fcfcfc",
                }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Typography
                      variant="subtitle1"
                      className="font-serif text-gray-500"
                      sx={{ fontStyle: "italic" }}
                    >
                      {/* {formatDistanceToNow(new Date(journal.date))} */}
                      {/* date */}
                    </Typography>

                    <Chip
                      label={"STOCK"}
                      size="small"
                      sx={{
                        backgroundColor: "#f0f7ff",
                        color: "#3b82f6",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        height: "1.5rem",
                      }}
                    />
                  </div>

                  <Typography
                    variant="body1"
                    className="font-serif text-gray-800 leading-relaxed mb-4"
                    sx={{
                      fontSize: "1.05rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {journal.content}
                  </Typography>

                  <div className="flex justify-end space-x-1">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(journal)}
                      sx={{ color: "#6b7280" }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(journal.id)}
                      sx={{ color: "#6b7280" }}
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
              <Typography variant="body1" className="text-gray-500 italic">
                No journal entries yet. Start documenting your trading journey.
              </Typography>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Journals;
