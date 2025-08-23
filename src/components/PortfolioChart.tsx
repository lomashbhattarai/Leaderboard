import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { formatAmount } from "../utils/helper";
import { PortfolioStock } from "../types/api";

interface Props {
  portfolioStocksFromDb: PortfolioStock[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
];

const PortfolioChart: React.FC<Props> = ({ portfolioStocksFromDb }) => {
  // Transform portfolio data for the pie chart
  const chartData = portfolioStocksFromDb.map((item) => ({
    name: item.stock?.symbol,
    value: item.quantity * (item.latestClosingPrice || 1),
  }));

  // Data for the bar chart showing total cost vs current value
  const barChartData = portfolioStocksFromDb.map((item) => ({
    name: item.stock?.symbol,
    totalCost: (item.buyPrice || 0) * item.quantity,
    currentValue: (item.latestClosingPrice || 0) * item.quantity,
  }));

  // Get the window width to determine chart dimensions
  const [chartDimensions, setChartDimensions] = React.useState({
    height: 500,
    outerRadius: 200,
    fontSize: "14px",
  });

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        // mobile breakpoint
        setChartDimensions({
          height: 300,
          outerRadius: 80,
          fontSize: "11px",
        });
      } else {
        setChartDimensions({
          height: 400,
          outerRadius: 150,
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

  if (chartData.length === 0) {
    return <div>No portfolio data available</div>;
  }

  return (
    <div className="portfolio-chart">
      <div
        className="chart-container"
        style={{
          width: "100%",
          height: chartDimensions.height,
          fontSize: chartDimensions.fontSize,
        }}
      >
        <ResponsiveContainer width="100%" height={chartDimensions.height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(1)}%)`
              }
              outerRadius={chartDimensions.outerRadius}
              fill="#8884d8"
              nameKey="name"
              dataKey="value"
              minAngle={3}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatAmount(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div
        className="chart-container"
        style={{
          width: "100%",
          height: chartDimensions.height,
          marginTop: 32,
          fontSize: chartDimensions.fontSize,
        }}
      >
        <ResponsiveContainer width="100%" height={chartDimensions.height}>
          <BarChart
            data={barChartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => formatAmount(value)} />
            <Legend />
            <Bar dataKey="totalCost" fill="#8884d8" name="Total Cost" />
            <Bar dataKey="currentValue" fill="#82ca9d" name="Current Value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioChart;
