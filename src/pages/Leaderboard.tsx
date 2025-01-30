import React from "react";
import { Alert, Button, Link, Tab, Typography } from "@mui/material";
import { ColumnConfig } from "../components/common/TableView";
import TableView from "../components/common/TableView";
import { useUsers, useLeaderboard } from "../api/queries";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Portfolio } from "../types/api";
import MeroshareImport from "../components/MeroshareImport";
import { usePortfolio } from "../hooks/usePortfolio";
import { useAuthContext } from "../contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

const formatPerformance = (value: number | string) => {
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
    label: "Portfolio",
    key: "portfolioName",
    render: (value, row) => {
      return (
        <RouterLink
          to={`/portfolio/${row.portfolioId}`}
          className="text-blue-600 hover:underline"
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

  const { addPortfolio } = usePortfolio();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  return (
    <div>
      <Alert severity="info" className="mb-4">
        Participate in the leaderboard by importing your portfolio. Only the
        allocation of your portfolio in percentage term will be shared with the
        community.
      </Alert>

      {user ? (
        <MeroshareImport
          addPortfolio={addPortfolio}
          columnsToImport={[
            "S.N",
            "Scrip",
            "Current Balance",
            "Last Transaction Price (LTP)",
            "Value at LTP",
          ]}
        />
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
        <Typography variant="h4" component="h1" className="mb-6">
          Portfolio Leaderboard
        </Typography>
        {isLeaderboardError ? (
          <Alert severity="error">Failed to load leaderboard data</Alert>
        ) : (
          <TableView columns={columns} tableData={leaderboardData || []} />
        )}
      </div>

      {/* <div className="mt-10">
        <Typography variant="h4" component="h1" className="mb-6">
          Users{" "}
        </Typography>
        {isUsersError ? (
          <Alert severity="error">Failed to load users data</Alert>
        ) : (
          <TableView
            tableData={users || []}
            columns={[
              {
                label: "Name",
                key: "fullName",
              },
              {
                label: "Portfolios",
                key: "portfolios",
                render: (portfolios) => {
                  return portfolios.slice(-1).map((portfolio: Portfolio) => (
                    <RouterLink
                      to={`/portfolio/${portfolio.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {portfolio.name}
                    </RouterLink>
                  ));
                },
              },
            ]}
          />
        )}
      </div> */}
    </div>
  );
};

export default Leaderboard;
