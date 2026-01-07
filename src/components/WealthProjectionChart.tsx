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
import { useShowAmounts } from "../contexts/ShowAmountsContext";
import MaskedAmount from "./common/MaskedAmount";

interface WealthProjectionChartProps {
  amount: number;
}

const WealthProjectionChart: React.FC<WealthProjectionChartProps> = ({
  amount,
}) => {
  const { showAmounts } = useShowAmounts();
  const [annualRate, setAnnualRate] = useState<number>(7);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);

  // Helper function to calculate projected value for a given number of years
  const calculateProjection = (years: number): number => {
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;

    // Future value of initial amount with compound interest
    const futureValueOfPrincipal =
      amount * Math.pow(1 + annualRate / 100, years);

    // Future value of monthly contributions (if any)
    let futureValueOfContributions = 0;
    if (monthlyContribution > 0 && monthlyRate > 0 && months > 0) {
      // FV of annuity formula: PMT × [((1 + r)^n - 1) / r]
      futureValueOfContributions =
        monthlyContribution *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else if (monthlyContribution > 0 && months > 0) {
      // If rate is 0, just multiply contribution by number of months
      futureValueOfContributions = monthlyContribution * months;
    }

    return futureValueOfPrincipal + futureValueOfContributions;
  };

  // Calculate projection data for the next 30 years
  const projectionData = useMemo(() => {
    if (!amount || amount <= 0) return [];

    const years = 30;
    const data = [];

    for (let year = 0; year <= years; year++) {
      const projectedAmount = calculateProjection(year);

      data.push({
        year: year,
        amount: Math.round(projectedAmount),
        label: year === 0 ? "Current" : `Year ${year}`,
      });
    }

    return data;
  }, [amount, annualRate, monthlyContribution]);

  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setAnnualRate(value);
    } else if (event.target.value === "") {
      setAnnualRate(0);
    }
  };

  const handleContributionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0) {
      setMonthlyContribution(value);
    } else if (event.target.value === "") {
      setMonthlyContribution(0);
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
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Monthly Contribution"
              type="number"
              value={monthlyContribution || ""}
              onChange={handleContributionChange}
              size="small"
              placeholder="0"
              inputProps={{
                min: 0,
                step: 100,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">NPR</InputAdornment>
                ),
              }}
              sx={{
                width: { xs: "100%", sm: 180 },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: 1,
                },
              }}
              variant="outlined"
            />
            <TextField
              label="Annual Return Rate"
              type="number"
              value={annualRate || ""}
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
                width: { xs: "100%", sm: 180 },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: 1,
                },
              }}
              variant="outlined"
            />
          </Box>
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
                if (!showAmounts) return "••••";
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}K`;
                }
                return value.toString();
              }}
            />
            <Tooltip
              formatter={(value: number) =>
                showAmounts ? formatAmount(value) : "Rs. ••••••"
              }
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
              formatter={() =>
                monthlyContribution > 0
                  ? `Projected Wealth (${annualRate}% annual + ${
                      showAmounts
                        ? formatAmount(monthlyContribution)
                        : "Rs. ••••••"
                    }/month)`
                  : `Projected Wealth (${annualRate}% annual)`
              }
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
            <MaskedAmount value={amount} />
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
            <MaskedAmount value={calculateProjection(10)} />
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
            <MaskedAmount value={calculateProjection(30)} />
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default WealthProjectionChart;
