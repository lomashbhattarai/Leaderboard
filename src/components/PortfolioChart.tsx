import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ScriptInPortfolio } from "../types/portfolio";
import { formatAmount } from "../utils/helper";

interface Props {
  portfolio: ScriptInPortfolio[];
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

const PortfolioChart: React.FC<Props> = ({ portfolio }) => {
  // Transform portfolio data for the pie chart
  const chartData = portfolio.map((item) => ({
    name: item.script,
    value: item.valueAtLTP,
  }));

  if (chartData.length === 0) {
    return <div>No portfolio data available</div>;
  }

  return (
    <div className="portfolio-chart">
      <h2>Portfolio Distribution</h2>
      <div className="chart-container" style={{ width: "100%", height: 500 }}>
        <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(1)}%)`
              }
              outerRadius={200}
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
