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

interface WealthChartProps {
  transactions: Transaction[];
}

const WealthChart: React.FC<WealthChartProps> = ({ transactions }) => {
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
        <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded">
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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="wealth" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default WealthChart;
