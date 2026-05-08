import React, { useState } from "react";
import { Card, Button, Skeleton } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useTheme } from "../../contexts/ThemeContext";

// Generate sample data
const generateData = (days: number, ticker?: string) => {
  // Starting price between 100 and 200
  let startPrice = ticker ? 150 : 100 + Math.random() * 100;
  const data = [];

  // Generate a somewhat realistic price movement
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.48) * 3; // Slightly biased towards positive returns
    startPrice = startPrice * (1 + change / 100);

    data.push({
      date: new Date(
        Date.now() - (days - i) * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: startPrice.toFixed(2),
    });
  }

  return data;
};

interface PerformanceChartProps {
  loading?: boolean;
  ticker?: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  loading = false,
  ticker,
}) => {
  const { currentTheme } = useTheme();
  const [timeRange, setTimeRange] = useState<"1W" | "1M" | "3M" | "1Y" | "5Y">(
    "1M"
  );

  const getDaysForRange = () => {
    switch (timeRange) {
      case "1W":
        return 7;
      case "1M":
        return 30;
      case "3M":
        return 90;
      case "1Y":
        return 365;
      case "5Y":
        return 365 * 5;
      default:
        return 30;
    }
  };

  const data = generateData(getDaysForRange(), ticker);

  // Calculate if chart is showing gain or loss
  const isPositive =
    Number(data[data.length - 1].value) >= Number(data[0].value);

  if (loading) {
    return <Skeleton variant="rectangular" width="100%" height="100%" />;
  }

  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <div className="mb-3 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium">Performance</h3>
          <p className="text-xs text-app-muted">
            {ticker ? ticker : "Portfolio"} - {isPositive ? "Up" : "Down"}{" "}
            {isPositive ? "+" : ""}
            {(
              (Number(data[data.length - 1].value) / Number(data[0].value) -
                1) *
              100
            ).toFixed(2)}
            % over {timeRange}
          </p>
        </div>
        <div className="flex space-x-1">
          {(
            [
              "1W",
              "1M",
              "3M",
              "1Y",
              // "5Y"
            ] as const
          ).map((range) => (
            <Button
              key={range}
              variant="outlined"
              size="small"
              sx={{
                px: 2,
                py: 0.5,
                fontSize: "0.75rem",
                ...(timeRange === range
                  ? {
                      bgcolor: currentTheme.accent.soft,
                      color: currentTheme.accent.primary,
                      borderColor: currentTheme.accent.primary,
                    }
                  : {
                      color: currentTheme.text.secondary,
                    }),
              }}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={currentTheme.border.subtle}
            />
            <XAxis
              dataKey="date"
              stroke={currentTheme.text.secondary}
              tick={{ fontSize: 10, fill: currentTheme.text.secondary }}
              tickMargin={10}
              tickFormatter={(value, index) => {
                // Show fewer labels on smaller time ranges
                if (timeRange === "1W" || timeRange === "1M") {
                  return index % 3 === 0 ? value : "";
                }
                return index % 5 === 0 ? value : "";
              }}
            />
            <YAxis
              domain={["dataMin - 5", "dataMax + 5"]}
              stroke={currentTheme.text.secondary}
              tick={{ fontSize: 10, fill: currentTheme.text.secondary }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              width={40}
            />
            <Tooltip
              formatter={(value) => [`$${Number(value).toFixed(2)}`, "Value"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <ReferenceLine
              y={Number(data[0].value)}
              stroke={currentTheme.text.tertiary}
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={
                isPositive
                  ? currentTheme.status.positive
                  : currentTheme.status.negative
              }
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PerformanceChart;
