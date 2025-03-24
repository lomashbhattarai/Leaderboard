import React, { useState, useCallback } from "react";
import {
  IconButton,
  TextField,
  Box,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import CategoryIcon from "@mui/icons-material/Category";
import { useUpdatePortfolio } from "../api/queries/usePortfolios";
import { useTheme } from "../contexts/ThemeContext";
import { getCommonStyles } from "../themes/commonComponents";
import { usePortfolio } from "../hooks/usePortfolio";

enum PortfolioPrivacy {
  PRIVATE = "PRIVATE",
  SHARE_ALL = "SHARE_ALL",
  SHARE_SECTORS = "SHARE_SECTORS",
}

const privacyOptions = [
  {
    value: PortfolioPrivacy.PRIVATE,
    label: "Private",
    icon: <LockIcon fontSize="small" />,
    tooltip: "Only you can see this portfolio",
  },
  {
    value: PortfolioPrivacy.SHARE_ALL,
    label: "Share All Holdings",
    icon: <PublicIcon fontSize="small" />,
    tooltip: "Everyone can see all your holdings",
  },
  {
    value: PortfolioPrivacy.SHARE_SECTORS,
    label: "Share Sectors Only",
    icon: <CategoryIcon fontSize="small" />,
    tooltip: "Only sector-wise allocation is visible to others",
  },
];

const PortfolioInfo: React.FC = () => {
  const { portfolioId, portfolioName, privacy } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(portfolioName);
  const { currentTheme } = useTheme();
  const styles = getCommonStyles(currentTheme);
  const updatePortfolio = useUpdatePortfolio(portfolioId);

  React.useEffect(() => {
    setEditedName(portfolioName);
  }, [portfolioName]);

  const handleSave = useCallback(async () => {
    if (editedName.trim() === "") return;

    try {
      await updatePortfolio.mutateAsync({ name: editedName.trim() });
      setIsEditing(false);
    } catch (error) {
      setEditedName(portfolioName);
    }
  }, [editedName, portfolioName, updatePortfolio]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditedName(portfolioName);
      setIsEditing(false);
    }
  };

  const handlePrivacyChange = async (event: SelectChangeEvent) => {
    const newPrivacy = event.target.value as PortfolioPrivacy;
    try {
      await updatePortfolio.mutateAsync({ privacy: newPrivacy });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      className="h-auto min-h-[130px]"
    >
      <Box className="flex flex-col items-stretch justify-between gap-2">
        <Box className="flex-grow">
          {isEditing ? (
            <Box className="flex items-center w-full">
              <TextField
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleSave}
                size="small"
                autoFocus
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: currentTheme.accent.primary,
                    },
                    "& input": {
                      color: currentTheme.accent.primary,
                    },
                  },
                }}
              />
              <IconButton
                onClick={handleSave}
                size="small"
                className="ml-1"
                disabled={updatePortfolio.isPending}
                sx={{ color: currentTheme.accent.primary }}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box className="flex items-center group w-full">
              <Typography
                variant="subtitle1"
                className="flex-grow"
                sx={{ fontWeight: "bold", color: currentTheme.accent.primary }}
              >
                {portfolioName}
              </Typography>
              <IconButton
                onClick={() => setIsEditing(true)}
                size="small"
                className="ml-1"
                sx={{ color: currentTheme.accent.primary }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        <Select
          value={privacy}
          onChange={handlePrivacyChange}
          size="small"
          fullWidth
          sx={{
            mt: 2,
            minWidth: { xs: "100%", sm: "200px" },
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: currentTheme.accent.primary,
            },
            "&.MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: currentTheme.accent.primary,
              },
            },
            "& .MuiSvgIcon-root": {
              color: currentTheme.accent.primary,
            },
          }}
          disabled={updatePortfolio.isPending}
        >
          {privacyOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: currentTheme.accent.primary,
              }}
            >
              <Tooltip title={option.tooltip}>
                <Box className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </Box>
              </Tooltip>
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

export default PortfolioInfo;
