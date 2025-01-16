import React from "react";
import { Alert, Button, Link, Tab, Typography } from "@mui/material";
import { ColumnConfig } from "../components/common/TableView";
import TableView from "../components/common/TableView";
import { useUsers } from "../api/queries";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Portfolio } from "../types/api";
import MeroshareImport from "../components/MeroshareImport";
import { usePortfolio } from "../hooks/usePortfolio";
import { useAuthContext } from "../contexts/AuthContext";

interface PortfolioPerformance {
  id: string;
  rank: number;
  ownerName: string;
  description: string;
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

// Mock data - replace with actual data from your backend
const mockData: PortfolioPerformance[] = [
  {
    id: "1",
    rank: 1,
    ownerName: "John Doe",
    description: "Growth Portfolio",
    performance: {
      daily: 2.5,
      weekly: 5.8,
      monthly: 12.3,
      yearly: 28.7,
    },
  },
  // Add more mock data as needed
];

const Leaderboard: React.FC = () => {
  const { data: users, isLoading, isError } = useUsers();
  const { addPortfolio } = usePortfolio();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const formatPerformance = (value: number) => {
    const color = value >= 0 ? "text-green-600" : "text-red-600";
    return (
      <span className={color}>
        {value >= 0 ? "+" : ""}
        {value.toFixed(2)}%
      </span>
    );
  };

  const columns: ColumnConfig[] = [
    { label: "Rank", key: "rank" },
    { label: "Owner", key: "ownerName" },
    { label: "Description", key: "description" },
    {
      label: "1 Day",
      key: "performance.daily",
      align: "right",
      getValue: (row) => row.performance.daily,
      render: (value) => formatPerformance(value),
    },
    {
      label: "1 Week",
      key: "performance.weekly",
      align: "right",
      getValue: (row) => row.performance.weekly,
      render: (value) => formatPerformance(value),
    },
    {
      label: "1 Month",
      key: "performance.monthly",
      align: "right",
      getValue: (row) => row.performance.monthly,
      render: (value) => formatPerformance(value),
    },
    {
      label: "1 Year",
      key: "performance.yearly",
      align: "right",
      getValue: (row) => row.performance.weekly,
      render: (value) => formatPerformance(value),
    },
  ];

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
          Portfolio Leaderboard (Coming Soon)
        </Typography>
      </div>

      <TableView columns={columns} tableData={mockData} />
      <div className="mt-10">
        <Typography variant="h4" component="h1" className="mb-6">
          Users{" "}
        </Typography>
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
      </div>
    </div>
  );
};

export default Leaderboard;
