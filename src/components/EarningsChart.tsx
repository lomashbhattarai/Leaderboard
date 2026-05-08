import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { Paper, Typography } from "@mui/material";
import { Transaction } from "../hooks/useEarningsCalculator";
import { useTheme } from "../contexts/ThemeContext";

interface WealthChartProps {
  transactions: Transaction[];
}

const WealthChart: React.FC<WealthChartProps> = ({ transactions }) => {
  const { currentTheme } = useTheme();
  const chartData = transactions
    .sort((a, b) => a.startDate?.getTime() - b.startDate?.getTime())
    .reduce((acc, transaction) => {
      const lastWealth = acc.length > 0 ? acc[acc.length - 1].wealth : 0;
      const newWealth =
        lastWealth +
        (transaction.type === "expense"
          ? -transaction.amount
          : transaction.amount);
      acc.push({
        date: transaction.startDate.toISOString().split("T")[0],
        wealth: newWealth,
        name: transaction.name, // Add the transaction name here
      });
      return acc;
    }, [] as { date: string; wealth: number; name: string }[]);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip p-2 rounded"
          style={{
            backgroundColor: currentTheme.surface.overlay,
            border: `1px solid ${currentTheme.border.default}`,
            color: currentTheme.text.primary,
          }}
        >
          <p className="label">{`Date: ${label}`}</p>
          <p className="intro">{`Wealth: NPR ${payload[0].value?.toFixed(
            2
          )}`}</p>
          <p className="name">{`Transaction: ${payload[0].payload.name}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Paper className="p-4">
      <Typography variant="h6" className="mb-4">
        Wealth Trend
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={currentTheme.border.subtle}
          />
          <XAxis dataKey="date" stroke={currentTheme.text.secondary} />
          <YAxis stroke={currentTheme.text.secondary} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="wealth"
            stroke={currentTheme.chart.palette[0]}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default WealthChart;
