import React from "react";
import { Box, Link, Stack, Typography, Tooltip } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { formatDistanceToNow } from "date-fns";
import { formatPerformance } from "../pages/Leaderboard";
import { useTheme } from "../contexts/ThemeContext";
import { LeaderboardEntry } from "../types/api";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import CategoryIcon from "@mui/icons-material/Category";

interface LeaderboardCardProps {
  row: LeaderboardEntry;
  index: number;
  showLimitedInfo: boolean;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  row,
  index,
  showLimitedInfo,
}) => {
  const { currentTheme } = useTheme();
  const navigate = useNavigate();

  const renderPrivacyIcon = () => {
    if (row.privacy === "PRIVATE") {
      return (
        <Tooltip title="Private portfolio">
          <LockIcon sx={{ fontSize: "0.875rem", color: "text.secondary" }} />
        </Tooltip>
      );
    } else if (row.privacy === "SHARE_ALL") {
      return (
        <Tooltip title="All holdings visible">
          <PublicIcon sx={{ fontSize: "0.875rem", color: "text.secondary" }} />
        </Tooltip>
      );
    } else if (row.privacy === "SHARE_SECTORS") {
      return (
        <Tooltip title="Only sectors visible">
          <CategoryIcon
            sx={{ fontSize: "0.875rem", color: "text.secondary" }}
          />
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <Box
      onClick={() => navigate(`/portfolio/${row.portfolioId}`)}
      sx={{ cursor: "pointer" }}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          {index === 0 ? (
            <EmojiEventsIcon
              sx={{
                color: currentTheme.status.warning,
                animation: "bounce 2s infinite",
                "@keyframes bounce": {
                  "0%, 100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(-3px)" },
                },
              }}
            />
          ) : (
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 1,
                backgroundColor: currentTheme.accent.primary,
                color: currentTheme.text.inverse,
                fontSize: "0.75rem",
                fontWeight: 600,
                minWidth: 28,
                textAlign: "center",
              }}
            >
              #{index + 1}
            </Box>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {row.portfolioName}
            </Typography>
            {row.userName !== "Anonymous User" && (
              <Typography variant="caption" color="text.secondary" noWrap>
                by {row.userName}
              </Typography>
            )}
          </Box>
          {renderPrivacyIcon()}
        </Stack>

        <Stack direction="row" justifyContent="space-between" textAlign="center">
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {formatPerformance(row.performance1D)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 Day
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {formatPerformance(row.performance1W)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 Week
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {formatPerformance(row.performance1M)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 Month
            </Typography>
          </Box>
        </Stack>

        {!showLimitedInfo && (
          <Typography variant="caption" color="text.secondary">
            {row.updatedAt
              ? `Last updated ${formatDistanceToNow(
                  new Date(row.updatedAt)
                )} ago`
              : ""}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default LeaderboardCard;
