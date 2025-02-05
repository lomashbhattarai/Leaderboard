import React from "react";
import {
  Alert,
  Button,
  Link,
  Tab,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Stack,
} from "@mui/material";
import { ColumnConfig } from "../components/common/TableView";
import TableView from "../components/common/TableView";
import { useUsers, useLeaderboard } from "../api/queries";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Portfolio } from "../types/api";
import MeroshareImport from "../components/MeroshareImport";
import { usePortfolio } from "../hooks/usePortfolio";
import { useAuthContext } from "../contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import PaletteIcon from "@mui/icons-material/Palette";
import { spaceThemes } from "../themes/spaceThemes";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LeaderboardCard from "../components/LeaderboardCard";

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
      return index + 1;
    },
  },
  {
    label: "Portfolio",
    key: "portfolioName",
    render: (value, row) => {
      return (
        <RouterLink
          to={`/portfolio/${row.portfolioId}`}
          className="text-blue-600 hover:underline truncate block"
        >
          {value}
        </RouterLink>
      );
    },
  },
  {
    label: "Owner",
    key: "userName",
  },
  {
    label: "1 Day",
    key: "performance1D",
    align: "right",
    getValue: (row) => row.performance1D,
    render: (value) => formatPerformance(value),
  },
  {
    label: "1 Week",
    key: "performance1W",
    align: "right",
    getValue: (row) => row.performance1W,
    render: (value) => formatPerformance(value),
  },
  {
    label: "1 Month",
    key: "performance1M",
    align: "right",
    getValue: (row) => row.performance1M,
    render: (value) => formatPerformance(value),
  },
  {
    label: "1 Year",
    key: "performance1Y",
    align: "right",
    getValue: (row) => row.performance1Y,
    render: (value) => formatPerformance(value),
  },
  {
    label: "Updated At",
    key: "updatedAt",
    render: (value) => {
      return `Updated ${formatDistanceToNow(new Date(value))} ago`;
    },
  },
];

const Leaderboard: React.FC = () => {
  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useUsers();
  const {
    data: leaderboardData,
    isLoading: isLeaderboardLoading,
    isError: isLeaderboardError,
  } = useLeaderboard();

  const { addPortfolio, portfolioId } = usePortfolio();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1">
          NEPSE Leaderboard
        </Typography>
      </div>

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
          >
            Add Your Portfolio
          </Button>
        )
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/signup")}
        >
          Sign up to participate
        </Button>
      )}

      <div className="mt-10">
        {isLeaderboardError ? (
          <Alert severity="error">Failed to load leaderboard data</Alert>
        ) : (
          <div>
            <TableView
              columns={columns}
              tableData={leaderboardData || []}
              customCardComponent={(row, index) => (
                <LeaderboardCard row={row} index={index} />
              )}
              // responsive={{
              //   fixedFirstColumn: true,
              //   minWidth: 120,
              //   breakpoint: 600,
              // }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
