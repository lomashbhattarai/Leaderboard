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
      sx={{
        cursor: "pointer",
        borderRadius: 0,
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: 1,
        paddingBottom: 1,
      }}
    >
      <Stack spacing={0}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
          {
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {index === 0 ? (
                <EmojiEventsIcon
                  sx={{
                    color: "#FFD700",
                    animation: "bounce 2s infinite",
                    "@keyframes bounce": {
                      "0%, 100%": { transform: "translateY(0)" },
                      "50%": { transform: "translateY(-3px)" },
                    },
                  }}
                />
              ) : (
                <Typography
                  variant="h6"
                  sx={{ color: currentTheme.accent.secondary }}
                >
                  {index + 1 + (index === 1 ? "nd" : index === 2 ? "rd" : "th")}{" "}
                  •
                </Typography>
              )}
            </Box>
          }
          <Typography variant="h6" component="div">
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>{row.portfolioName}</Typography>
              {renderPrivacyIcon()}
              {row.userName !== "Anonymous User" && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    by {row.userName}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography variant="body2">
                {formatPerformance(row.performance1D)}
              </Typography>
              <Typography variant="body2">1 Day</Typography>
            </Box>
            <Box>
              <Typography variant="body2">
                {formatPerformance(row.performance1W)}
              </Typography>
              <Typography variant="body2">1 Week</Typography>
            </Box>
            <Box>
              <Typography variant="body2">
                {formatPerformance(row.performance1M)}
              </Typography>
              <Typography variant="body2">1 Month</Typography>
            </Box>
          </Stack>

          {!showLimitedInfo && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">
                {row.updatedAt
                  ? `Last updated ${formatDistanceToNow(
                      new Date(row.updatedAt)
                    )} ago`
                  : ""}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default LeaderboardCard;
