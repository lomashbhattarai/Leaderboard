import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { WealthEntry } from "../types/wealth";
import { formatAmount } from "../utils/helper";

interface WealthChartProps {
  wealthEntries: WealthEntry[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const WealthChart: React.FC<WealthChartProps> = ({ wealthEntries }) => {
  // Group and sum amounts by asset type
  const chartData = wealthEntries.reduce(
    (acc: { name: string; value: number }[], entry) => {
      console.log("entry", entry);
      const existingType = acc.find((item) => item.name === entry.assetType);
      if (existingType) {
        existingType.value += parseFloat(entry.amount.toString());
      } else {
        acc.push({
          name: entry.assetType,
          value: parseFloat(entry.amount.toString()),
        });
      }
      return acc;
    },
    []
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => formatAmount(value)} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default WealthChart;
