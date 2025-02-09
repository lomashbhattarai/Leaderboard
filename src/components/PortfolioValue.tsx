import React, { useState, useCallback } from "react";
import AmountSummary from "./common/AmountSummary";
import { PortfolioStock } from "../types/api";
import {
  IconButton,
  TextField,
  Box,
  alpha,
  Typography,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { useUpdatePortfolio } from "../api/queries/usePortfolios";
import { formatAmount } from "../utils/helper";
import { useTheme } from "../contexts/ThemeContext";
import { getCommonStyles } from "../themes/commonComponents";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import CategoryIcon from "@mui/icons-material/Category";

interface PortfolioValueProps {
  portfolioId: number;
  portfolioName: string;
  portfolioStocksFromDb: PortfolioStock[];
  privacy: PortfolioPrivacy;
}

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

const PortfolioValue: React.FC<PortfolioValueProps> = ({
  portfolioId,
  portfolioName,
  portfolioStocksFromDb,
  privacy,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(portfolioName);

  React.useEffect(() => {
    setEditedName(portfolioName);
  }, [portfolioName]);

  const updatePortfolio = useUpdatePortfolio(portfolioId);

  const totalValue = portfolioStocksFromDb.reduce(
    (acc, item) => acc + (item.latestClosingPrice || 1) * item.quantity,
    0
  );

  const handleSave = useCallback(async () => {
    if (editedName.trim() === "") return;

    try {
      await updatePortfolio.mutateAsync({ name: editedName.trim() });
      setIsEditing(false);
    } catch (error) {
      // Error is handled by the mutation
      setEditedName(portfolioName); // Reset to original on error
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

  const { currentTheme } = useTheme();
  const styles = getCommonStyles(currentTheme);

  const handlePrivacyChange = async (event: SelectChangeEvent) => {
    const newPrivacy = event.target.value as PortfolioPrivacy;
    try {
      await updatePortfolio.mutateAsync({ privacy: newPrivacy });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        ...styles.paper,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
      className="h-[130px]"
    >
      <Box className="flex items-center justify-between">
        <Box className="flex items-center">
          {isEditing ? (
            <Box className="flex items-center">
              <TextField
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleSave}
                size="small"
                autoFocus
                className="min-w-[200px]"
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
            <Box className="flex items-center group">
              <span>{portfolioName}</span>
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
          sx={{
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

      <Typography
        variant="h4"
        sx={{
          color: currentTheme.accent.primary,
          fontWeight: 600,
          letterSpacing: "-0.5px",
        }}
      >
        {formatAmount(totalValue)}
      </Typography>
    </Paper>
  );
};

export default PortfolioValue;
