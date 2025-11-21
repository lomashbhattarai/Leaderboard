import React, { useState, useMemo } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  InputAdornment,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatAmount } from "../utils/helper";

interface WealthProjectionChartProps {
  amount: number;
}

const WealthProjectionChart: React.FC<WealthProjectionChartProps> = ({
  amount,
}) => {
  const [annualRate, setAnnualRate] = useState<number>(7);

  // Calculate projection data for the next 30 years
  const projectionData = useMemo(() => {
    if (!amount || amount <= 0) return [];

    const years = 30;
    const data = [];

    for (let year = 0; year <= years; year++) {
      const projectedAmount = amount * Math.pow(1 + annualRate / 100, year);
      data.push({
        year: year,
        amount: Math.round(projectedAmount),
        label: year === 0 ? "Current" : `Year ${year}`,
      });
    }

    return data;
  }, [amount, annualRate]);

  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setAnnualRate(value);
    }
  };

  if (!amount || amount <= 0) {
    return null;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mt: 3,
        borderRadius: 2,
        background:
          "linear-gradient(135deg, rgba(168, 224, 99, 0.4) 0%, rgba(168, 224, 99, 0.1) 100%)",
      }}
    >
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Wealth Projection
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 1.5,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            See how your wealth could grow over time with compound interest
          </Typography>
          <TextField
            label="Annual Compounding Rate"
            type="number"
            value={annualRate}
            onChange={handleRateChange}
            size="small"
            inputProps={{
              min: 0,
              max: 100,
              step: 0.1,
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            sx={{
              width: { xs: "100%", sm: 200 },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                borderRadius: 1,
              },
            }}
            variant="outlined"
          />
        </Box>
      </Box>

      <Box sx={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={projectionData}
            margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="year"
              label={{
                value: "Years",
                position: "insideBottom",
                offset: -5,
                style: { textAnchor: "middle", fill: "#666" },
              }}
              stroke="#666"
            />
            <YAxis
              label={{
                value: "Amount (NPR)",
                angle: -90,
                position: "insideLeft",
                offset: -14,
                style: { textAnchor: "middle", fill: "#666" },
              }}
              stroke="#666"
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}K`;
                }
                return value.toString();
              }}
            />
            <Tooltip
              formatter={(value: number) => formatAmount(value)}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.label;
                }
                return `Year ${label}`;
              }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={() => `Projected Wealth (${annualRate}% annual)`}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#1976d2"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 5, fill: "#1976d2" }}
              name="Projected Wealth"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ mt: 1.5, display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Current Value
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatAmount(amount)}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            10 Year Projection
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatAmount(amount * Math.pow(1 + annualRate / 100, 10))}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            30 Year Projection
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatAmount(amount * Math.pow(1 + annualRate / 100, 30))}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default WealthProjectionChart;
