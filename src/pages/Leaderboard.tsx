import React, { useState } from "react";
import {
  Alert,
  Button,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Stack,
  Divider,
} from "@mui/material";
import { ColumnConfig } from "../components/common/TableView";
import TableView from "../components/common/TableView";
import { useUsers, useLeaderboard } from "../api/queries";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { usePortfolio } from "../hooks/usePortfolio";
import { useAuthContext } from "../contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LeaderboardCard from "../components/LeaderboardCard";
import LockIcon from "@mui/icons-material/Lock";
import CategoryIcon from "@mui/icons-material/Category";
import { useTheme } from "../contexts/ThemeContext";
import { Search as SearchIcon } from "@mui/icons-material";
import RankedPositionCard from "../components/RankedPositionCard";
import type { LeaderboardEntry } from "../types/api";

export const formatPerformance = (value: number | string) => {
  if (!value && value !== 0) {
    return <span className="text-gray-500">N/A</span>;
  }

  const numValue = typeof value === "string" ? parseFloat(value) : value;
  const color = numValue >= 0 ? "text-green-600" : "text-red-600";
  return (
    <span className={color}>
      {numValue >= 0 ? "+" : ""}
      {numValue.toFixed(2)}%
    </span>
  );
};

const columns: ColumnConfig[] = [
  {
    label: "Rank",
    key: "rank",
    align: "center",
    render: (_, row, index) => {
      if (index === 0) {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EmojiEventsIcon
              sx={{
                color: "#FFD700", // Gold color
                animation: "bounce 2s infinite",
                "@keyframes bounce": {
                  "0%, 100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(-3px)" },
                },
              }}
            />
          </Box>
        );
      }
      return <Typography fontWeight={600}>{index + 1}</Typography>;
    },
  },
  {
    label: "Portfolio",
    key: "portfolioName",
    minWidth: 200,
    render: (value, row) => {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <RouterLink
            to={`/portfolio/${row.portfolioId}`}
            className="hover:underline truncate block"
          >
            <Typography variant="subtitle2" fontWeight={600}>
              {value}
            </Typography>
          </RouterLink>
          {row.privacy === "PRIVATE" && (
            <LockIcon sx={{ fontSize: "0.875rem", color: "text.secondary" }} />
          )}

          {row.privacy === "SHARE_SECTORS" && (
            <CategoryIcon
              sx={{ fontSize: "0.875rem", color: "text.secondary" }}
            />
          )}
        </Box>
      );
    },
  },
  {
    label: "Owner",
    key: "userName",
    render: (value) => (
      <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
        {value}
      </Typography>
    ),
  },
  {
    label: "1 Day",
    key: "performance1D",
    align: "right",
    getValue: (row) => row.performance1D,
    render: (value) => (
      <Typography variant="body2">{formatPerformance(value)}</Typography>
    ),
  },
  {
    label: "1 Week",
    key: "performance1W",
    align: "right",
    getValue: (row) => row.performance1W,
    render: (value) => (
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {formatPerformance(value)}
      </Typography>
    ),
  },
  {
    label: "1 Month",
    key: "performance1M",
    align: "right",
    getValue: (row) => row.performance1M,
    render: (value) => (
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {formatPerformance(value)}
      </Typography>
    ),
  },
  {
    label: "1 Year",
    key: "performance1Y",
    align: "right",
    getValue: (row) => row.performance1Y,
    render: (value) => (
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {formatPerformance(value)}
      </Typography>
    ),
  },
  {
    label: "Updated",
    key: "updatedAt",
    render: (value) => {
      return value ? (
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 500,
            color: "text.secondary",
          }}
        >
          {formatDistanceToNow(new Date(value))} ago
        </Typography>
      ) : (
        ""
      );
    },
  },
];

const Leaderboard: React.FC<{ rowLimit?: number; isCompact?: boolean }> = ({
  rowLimit, // using roLimit to identify if the leaderboard is in dashboard or in leaderboard page
  isCompact = true,
}) => {
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const {
    data: leaderboardData,
    isLoading: isLeaderboardLoading,
    isError: isLeaderboardError,
  } = useLeaderboard();

  const { addPortfolio, portfolioId } = usePortfolio();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Filter data based on rowLimit if provided
  const displayData = rowLimit
    ? leaderboardData?.slice(0, rowLimit)
    : leaderboardData;

  // Filter data based on search query
  const filteredData = searchQuery
    ? displayData?.filter(
        (entry) =>
          entry.portfolioName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          entry.userName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : displayData;

  // Find user's portfolio and rank in leaderboard data
  const userPortfolio =
    user && leaderboardData
      ? leaderboardData.find((portfolio) => portfolio.userId === user.id)
      : undefined;
  const userRank =
    userPortfolio && leaderboardData
      ? leaderboardData.findIndex((portfolio) => portfolio.userId === user.id) +
        1
      : undefined;

  // Find today's top gainer based on 1D performance
  const topGainer = leaderboardData?.reduce((top, current) => {
    if (!top) return current;
    return current.performance1D > top.performance1D ? current : top;
  }, undefined as LeaderboardEntry | undefined);

  // Find top gainer's rank
  const topGainerRank =
    topGainer && leaderboardData
      ? leaderboardData.findIndex(
          (p) => p.portfolioId === topGainer.portfolioId
        ) + 1
      : undefined;

  return (
    <div className="mb-10 mt-5">
      <div className="px-4 sm:px-0">
        {!portfolioId && (
          <Alert severity="info" className="mb-4">
            Participate in the leaderboard by adding your portfolio.
          </Alert>
        )}

        {user ? (
          portfolioId ? null : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/portfolio")}
              sx={{
                backgroundColor: currentTheme.accent.primary,
                "&:hover": {
                  backgroundColor: currentTheme.accent.secondary,
                },
              }}
            >
              Add Your Portfolio
            </Button>
          )
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/signup")}
            sx={{
              backgroundColor: currentTheme.accent.primary,
              "&:hover": {
                backgroundColor: currentTheme.accent.secondary,
              },
            }}
          >
            Sign up to participate
          </Button>
        )}
      </div>

      <div className="mt-4">
        {rowLimit && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{ borderTop: { xs: "1px solid black", sm: "none" } }}
            spacing={{ xs: 0, sm: 2 }}
          >
            <RankedPositionCard
              label="Your Position"
              portfolio={userPortfolio}
              rank={userRank}
            />
            <Divider
              orientation="vertical"
              flexItem
              sx={{ color: "text.secondary", height: "1px" }}
            />

            <RankedPositionCard
              label="Today's Top Gainer"
              portfolio={topGainer}
              rank={topGainerRank}
            />
          </Stack>
        )}
      </div>

      <Stack
        direction="row"
        spacing={2}
        sx={{ paddingLeft: { xs: 2, sm: 0 }, marginTop: 4 }}
      >
        <Box>
          <Typography
            variant="body1"
            component="h1"
            sx={{ fontWeight: "bold", mb: 0.5 }}
          >
            NEPSE Leaderboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and compare top-performing portfolios
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "flex-start",
            alignItems: { xs: "flex-start", md: "flex-start" },
            mb: 2,
            gap: 2,
            mt: 2,
          }}
        >
          {!rowLimit && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                width: { xs: "100%", md: "auto" },
                flexWrap: "wrap",
                paddingLeft: 2,
                paddingRight: 2,
              }}
            >
              <TextField
                placeholder="Search portfolios..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: { xs: "100%", md: "250px" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        fontSize="small"
                        sx={{ color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}
        </Box>
      </Stack>

      <div className="mt-5">
        {isLeaderboardError ? (
          <Alert severity="error">Failed to load leaderboard data</Alert>
        ) : (
          <div>
            <TableView
              columns={columns}
              tableData={filteredData || []}
              customCardComponent={(row, index) => (
                <LeaderboardCard
                  row={row}
                  index={index}
                  showLimitedInfo={!!rowLimit}
                />
              )}
              isCompact={isCompact}
            />
            {rowLimit && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/leaderboard")}
                  sx={{
                    backgroundColor: currentTheme.accent.primary,
                    "&:hover": {
                      backgroundColor: currentTheme.accent.secondary,
                    },
                  }}
                >
                  View Full Leaderboard
                </Button>
              </Box>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
