import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Skeleton } from "@mui/material";
import { useTheme } from "../../contexts/ThemeContext";

// Sample allocation data
const data = [
  { name: "Technology", value: 42 },
  { name: "Healthcare", value: 18 },
  { name: "Consumer", value: 15 },
  { name: "Finance", value: 12 },
  { name: "Other", value: 13 },
];

interface AllocationChartProps {
  loading?: boolean;
}

const AllocationChart: React.FC<AllocationChartProps> = ({
  loading = false,
}) => {
  const { currentTheme } = useTheme();
  const chartPalette = currentTheme.chart.palette;

  if (loading) {
    return <Skeleton variant="circular" width="100%" height="100%" />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius="80%"
          innerRadius="40%"
          fill={chartPalette[0]}
          dataKey="value"
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={chartPalette[index % chartPalette.length]}
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconSize={8}
          iconType="circle"
          formatter={(value) => (
            <span style={{ fontSize: "10px", color: currentTheme.text.secondary }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AllocationChart;
