import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
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
              // innerRadius={60}
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
            {/* <Legend verticalAlign="bottom" height={36} /> */}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioChart;
