import React from "react";
import { Link, Tab, Typography } from "@mui/material";
import { ColumnConfig } from "../components/common/TableView";
import TableView from "../components/common/TableView";
import { useUsers, useCreateUser, useUser } from "../api/queries";
import { Link as RouterLink } from "react-router-dom";
import { Portfolio } from "../types/api";

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

  console.log({
    users,
  });

  return (
    <div>
      <Typography variant="h4" component="h1" className="mb-6">
        Portfolio Leaderboard
      </Typography>
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
              label: "Email",
              key: "email",
            },
            {
              label: "Portfolios",
              key: "portfolios",
              render: (portfolios) => {
                return portfolios.map((portfolio: Portfolio) => (
                  <RouterLink to={`/portfolio/${portfolio.id}`}>
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
