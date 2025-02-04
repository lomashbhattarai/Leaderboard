import React from "react";
import { Box, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { formatDistanceToNow } from "date-fns";
import { formatPerformance } from "../pages/Leaderboard";
import { useTheme } from "../contexts/ThemeContext";
import { LeaderboardEntry } from "../types/api";

interface LeaderboardCardProps {
  row: LeaderboardEntry;
  index: number;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ row, index }) => {
  const { currentTheme } = useTheme();

  return (
    <Stack spacing={1}>
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
                {index + 1 + (index === 1 ? "nd" : index === 2 ? "rd" : "th")} •
              </Typography>
            )}
          </Box>
        }
        <Typography variant="h6" component="div">
          <Link
            component={RouterLink}
            to={`/portfolio/${row.portfolioId}`}
            sx={{
              textDecoration: "none",
              color: currentTheme.accent.primary,
            }}
          >
            {row.portfolioName}
          </Link>
        </Typography>
      </Stack>

      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          <Typography
            variant="body2"
            sx={{ color: currentTheme.accent.primary }}
          >
            by {row.userName}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ color: currentTheme.accent.primary }}
        >
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

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ color: currentTheme.accent.primary }}
        >
          <Typography variant="body2">
            last updated {formatDistanceToNow(new Date(row.updatedAt))} ago
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default LeaderboardCard;
