import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { usePublicPortfolio } from "../api/queries/usePortfolios";
import TableView, { ColumnConfig } from "../components/common/TableView";
import { Link as RouterLink } from "react-router-dom";
import { formatPerformance } from "./Leaderboard";
import Tooltip from "../components/common/Tooltip";
import { format } from "date-fns";

const SharedPortfolio: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: publicPortfolio,
    isLoading,
    error,
  } = usePublicPortfolio(Number(id));

  const columns: ColumnConfig[] = [
    {
      label: "Symbol",
      key: "symbol",
      render: (value) => (
        <RouterLink
          to={`/stock/${value}`}
          className="text-blue-600 hover:underline"
        >
          {value}
        </RouterLink>
      ),
    },
    {
      label: "Closing Price",
      key: "latestPrice",
      align: "right",
      render: (value) => `${value}`,
    },
    {
      label: "1D",
      key: "dailyPerformancePercentage",
      align: "right",
      render: () => "NA",
    },
    {
      label: "1W",
      key: "weeklyPerformancePercentage",
      align: "right",
      render: (value, row) => {
        const { weekAgoPrice, latestPrice, weekAgoDate, latestDate } = row;

        const formattedValue = formatPerformance(value);
        return (
          <Tooltip
            content={
              <div className="text-xs text-gray-300 mt-1">
                <div>
                  {format(new Date(weekAgoDate), "do MMMM")}: {weekAgoPrice}
                </div>
                <div>
                  {format(new Date(latestDate), "do MMMM")}: {latestPrice}
                </div>
              </div>
            }
            position="top"
          >
            {formattedValue}
          </Tooltip>
        );
      },
    },
    {
      label: "1M",
      key: "monthlyPerformancePercentage",
      align: "right",
      render: () => "NA",
    },
    {
      label: "Allocation (%)",
      key: "percentage",
      align: "right",
      render: (value) => `${value.toFixed(2)}%`,
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading portfolio</div>;
  if (!publicPortfolio) return <div>No portfolio found</div>;

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {/* {data.userName}'s */}
        {publicPortfolio.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Allocation Table</h2>
          <TableView
            columns={columns}
            tableData={publicPortfolio.portfolioStocks || []}
          />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Allocation Chart</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={publicPortfolio.portfolioStocks}
                dataKey="percentage"
                nameKey="symbol"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label={({ symbol, percent }) =>
                  `${symbol} ${(percent * 100).toFixed(0)}%`
                }
              >
                {publicPortfolio.portfolioStocks?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <RechartTooltip />
              {/* <Legend /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
];

export default SharedPortfolio;
