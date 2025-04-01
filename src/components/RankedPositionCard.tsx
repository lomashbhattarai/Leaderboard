"use client";
import {
  ArrowDownward as ArrowDownIcon,
  ArrowUpward as ArrowUpIcon,
  ShowChart as ShowChartIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  LinearProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { useAuthContext } from "../contexts/AuthContext";
import { LeaderboardEntry } from "../types/api";
import { useNavigate } from "react-router-dom";

interface RankedPositionCardProps {
  portfolio?: LeaderboardEntry;
  rank?: number;
  label?: string;
}

export default function RankedPositionCard({
  portfolio,
  rank,
  label = "Your Position",
}: RankedPositionCardProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  const getPerformanceColor = (value: number) => {
    if (value > 0) return theme.palette.success.main;
    if (value < 0) return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  const getPerformanceIcon = (value: number) => {
    if (value > 0) return <ArrowUpIcon sx={{ fontSize: "0.75rem" }} />;
    if (value < 0) return <ArrowDownIcon sx={{ fontSize: "0.75rem" }} />;
    return null;
  };

  // Calculate rank change

  const { user } = useAuthContext();

  return user && portfolio ? (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title={label}
        titleTypographyProps={{
          variant: "body2",
          color: "text.secondary",
          fontWeight: 500,
        }}
        sx={{ pb: 0 }}
      />
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.5,
            }}
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate(`/portfolio/${portfolio.portfolioId}`)}
            >
              {portfolio.portfolioName}
            </Typography>
            <Chip
              label={`#${rank}`}
              color="primary"
              size="small"
              sx={{
                fontWeight: "bold",
                bgcolor: theme.palette.primary.main,
                "& .MuiChip-label": { px: 1 },
                marginLeft: 4,
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              1D
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: getPerformanceColor(portfolio.performance1D),
              }}
            >
              {getPerformanceIcon(portfolio.performance1D)}
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: getPerformanceColor(portfolio.performance1D) }}
              >
                {portfolio.performance1D}%
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              1W
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: getPerformanceColor(portfolio.performance1W),
              }}
            >
              {getPerformanceIcon(portfolio.performance1W)}
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: getPerformanceColor(portfolio.performance1W) }}
              >
                {portfolio.performance1W}%
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              1M
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: getPerformanceColor(portfolio.performance1M),
              }}
            >
              {getPerformanceIcon(portfolio.performance1M)}
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: getPerformanceColor(portfolio.performance1M) }}
              >
                {portfolio.performance1M}%
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<ShowChartIcon />}
            onClick={() => navigate(`/portfolio/${portfolio.portfolioId}`)}
          >
            View Details
          </Button>
        </Box> */}
      </CardContent>
    </Card>
  ) : (
    <Card sx={{ flex: 1 }}>
      <CardHeader
        title={label}
        titleTypographyProps={{
          variant: "body2",
          color: "text.secondary",
          fontWeight: 500,
        }}
        sx={{ pb: 0 }}
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Not Ranked
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a portfolio to compete
            </Typography>
          </Box>
          <Button variant="contained" size="small" color="primary">
            Start Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
