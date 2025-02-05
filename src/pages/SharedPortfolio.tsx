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
import { Stack, Box } from "@mui/material";

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
      render: (value, row) => {
        const { latestPrice, latestDate, dayAgoPrice, dayAgoDate } = row;
        return (
          <PriceChangeTooltip
            previousPrice={dayAgoPrice}
            previousDate={dayAgoDate}
            latestPrice={latestPrice}
            latestDate={latestDate}
            value={value}
          />
        );
      },
    },
    {
      label: "1W",
      key: "weeklyPerformancePercentage",
      align: "right",
      render: (value, row) => {
        const { weekAgoPrice, latestPrice, weekAgoDate, latestDate } = row;
        return (
          <PriceChangeTooltip
            previousPrice={weekAgoPrice}
            previousDate={weekAgoDate}
            latestPrice={latestPrice}
            latestDate={latestDate}
            value={value}
          />
        );
      },
    },
    {
      label: "1M",
      key: "monthlyPerformancePercentage",
      align: "right",
      render: (value, row) => {
        const { monthAgoPrice, latestPrice, monthAgoDate, latestDate } = row;
        return (
          <PriceChangeTooltip
            previousPrice={monthAgoPrice}
            previousDate={monthAgoDate}
            latestPrice={latestPrice}
            latestDate={latestDate}
            value={value}
          />
        );
      },
    },
    {
      label: "Allocation (%)",
      key: "percentage",
      align: "right",
      render: (value) => `${value.toFixed(2)}%`,
    },
  ];

  // Add chart dimensions state
  const [chartDimensions, setChartDimensions] = React.useState({
    height: 400,
    outerRadius: 150,
    fontSize: "14px",
  });

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setChartDimensions({
          height: 300,
          outerRadius: 100,
          fontSize: "11px",
        });
      } else {
        setChartDimensions({
          height: 400,
          outerRadius: 130,
          fontSize: "14px",
        });
      }
    };

    // Set initial dimensions
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading portfolio</div>;
  if (!publicPortfolio) return <div>No portfolio found</div>;

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {/* {data.userName}'s */}
        {publicPortfolio.name}
      </h1>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        sx={{ width: "100%" }}
      >
        <Box
          sx={{
            flex: "0 0 60%",
            order: { xs: 2, md: 1 },
          }}
        >
          <TableView
            columns={columns}
            tableData={publicPortfolio.portfolioStocks || []}
          />
        </Box>

        <Box
          sx={{
            flex: "0 0 40%",
            order: { xs: 1, md: 2 },
            fontSize: chartDimensions.fontSize,
          }}
        >
          <ResponsiveContainer width="100%" height={chartDimensions.height}>
            <PieChart>
              <Pie
                data={publicPortfolio.portfolioStocks}
                dataKey="percentage"
                nameKey="symbol"
                cx="50%"
                cy="50%"
                outerRadius={chartDimensions.outerRadius}
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
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Stack>
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

const PriceChangeTooltip = ({
  previousPrice,
  previousDate,
  latestPrice,
  latestDate,
  value,
}: {
  previousPrice: number;
  previousDate: string;
  latestPrice: number;
  latestDate: string;
  value: number;
}) => {
  const formattedValue = formatPerformance(value);

  return (
    <Tooltip
      content={
        <>
          <div>
            {previousDate
              ? `${format(new Date(previousDate), "do MMMM")}: ${previousPrice}`
              : "No historical data"}
          </div>
          <div>
            {latestDate
              ? `${format(new Date(latestDate), "do MMMM")}: ${latestPrice}`
              : "No historical data"}
          </div>
        </>
      }
      position="top"
    >
      {formattedValue}
    </Tooltip>
  );
};
