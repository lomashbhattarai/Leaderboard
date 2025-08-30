import React from "react";
import { useParams } from "react-router-dom";
import { usePublicPortfolio } from "../api/queries/usePortfolios";
import {
  Avatar,
  Box,
  Stack,
  Tooltip as MuiTooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import CategoryIcon from "@mui/icons-material/Category";
import TableChartIcon from "@mui/icons-material/TableChart";
import ViewListIcon from "@mui/icons-material/ViewList";
import { PortfolioPrivacy } from "../types/api";
import { useTheme } from "../contexts/ThemeContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
} from "recharts";
import TableView, { ColumnConfig } from "../components/common/TableView";
import StockSymbolLink from "../components/common/StockSymbolLink";
import Tooltip from "../components/common/Tooltip";
import { formatPerformance } from "./Leaderboard";
import { format } from "date-fns";

const SharedPortfolio: React.FC = () => {
  const { currentTheme } = useTheme();
  const { id } = useParams<{ id: string }>();

  const { data: publicPortfolio, isLoading, error } = usePublicPortfolio(
    Number(id)
  );

  const columns: ColumnConfig[] = [
    {
      label: "Symbol",
      key: "symbol",
      render: (value) => <StockSymbolLink symbol={value} />,
    },
    {
      label: "Closing Price",
      key: "latestPrice",
      align: "right",
      render: (value) => `${value}`,
    },
    {
      label: "1D",
      key: "dailyPerformancePercentage",
      align: "right",
      render: (value, row) => {
        const { latestPrice, latestDate, dayAgoPrice, dayAgoDate } = row;
        return (
          <PriceChangeTooltip
            previousPrice={dayAgoPrice}
            previousDate={dayAgoDate}
            latestPrice={latestPrice}
            latestDate={latestDate}
            value={value}
          />
        );
      },
    },
    {
      label: "1W",
      key: "weeklyPerformancePercentage",
      align: "right",
      render: (value, row) => {
        const { weekAgoPrice, latestPrice, weekAgoDate, latestDate } = row;
        return (
          <PriceChangeTooltip
            previousPrice={weekAgoPrice}
            previousDate={weekAgoDate}
            latestPrice={latestPrice}
            latestDate={latestDate}
            value={value}
          />
        );
      },
    },
    {
      label: "1M",
      key: "monthlyPerformancePercentage",
      align: "right",
      render: (value, row) => {
        const { monthAgoPrice, latestPrice, monthAgoDate, latestDate } = row;
        return (
          <PriceChangeTooltip
            previousPrice={monthAgoPrice}
            previousDate={monthAgoDate}
            latestPrice={latestPrice}
            latestDate={latestDate}
            value={value}
          />
        );
      },
    },
    {
      label: "Allocation (%)",
      key: "percentage",
      align: "right",
      render: (value) => `${value.toFixed(2)}%`,
    },
  ];

  const sortedStocks = React.useMemo(
    () =>
      [...(publicPortfolio?.portfolioStocks || [])].sort(
        (a, b) => b.percentage - a.percentage
      ),
    [publicPortfolio?.portfolioStocks]
  );

  const [viewMode, setViewMode] = React.useState<"list" | "table">("list");

  const [chartDimensions, setChartDimensions] = React.useState({
    height: 350,
    outerRadius: 100,
    fontSize: "10px",
  });

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setChartDimensions({
          height: 300,
          outerRadius: 100,
          fontSize: "10px",
        });
      } else {
        setChartDimensions({
          height: 400,
          outerRadius: 130,
          fontSize: "12px",
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderPieChartContent = () => (
    <PieChart>
      <Pie
        data={publicPortfolio?.portfolioStocks}
        dataKey="percentage"
        nameKey="symbol"
        cx="50%"
        cy="50%"
        outerRadius={chartDimensions.outerRadius}
        fill={currentTheme.accent.primary}
        label={({ symbol, percent }) => `${symbol} ${(percent * 100).toFixed(0)}%`}
      >
        {publicPortfolio?.portfolioStocks?.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
      <RechartTooltip />
    </PieChart>
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading portfolio</div>;
  if (!publicPortfolio) return <div>No portfolio found</div>;

  return (
    <div className="mx-auto">
      <Box className="flex items-center justify-between gap-2 mb-4 mt-4">
        <Box className="flex items-center gap-2">
          <Typography
            variant="subtitle1"
            component="h1"
            sx={{ color: currentTheme.text.primary }}
          >
            {publicPortfolio.name}
          </Typography>
          <MuiTooltip title={getPrivacyInfo(publicPortfolio.privacy).text}>
            <span style={{ color: currentTheme.text.secondary }}>
              {getPrivacyInfo(publicPortfolio.privacy).icon}
            </span>
          </MuiTooltip>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <ViewListIcon
            onClick={() => setViewMode("list")}
            sx={{
              cursor: "pointer",
              color:
                viewMode === "list"
                  ? currentTheme.accent.primary
                  : currentTheme.text.secondary,
            }}
          />
          <TableChartIcon
            onClick={() => setViewMode("table")}
            sx={{
              cursor: "pointer",
              color:
                viewMode === "table"
                  ? currentTheme.accent.primary
                  : currentTheme.text.secondary,
            }}
          />
        </Box>
      </Box>

      {publicPortfolio.privacy === PortfolioPrivacy.PRIVATE ? (
        <div style={{ color: currentTheme.text.primary }}>Private Portfolio</div>
      ) : viewMode === "list" ? (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
              color: currentTheme.text.secondary,
            }}
          >
            <Typography variant="body2">Stock</Typography>
            <Typography variant="body2">Weight</Typography>
          </Box>
          <Stack spacing={1}>
            {sortedStocks.map((stock) => {
              const displayName = stock.name || stock.symbol;
              const initials = displayName?.charAt(0) || "";
              return (
                <Box
                  key={stock.symbol}
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 4,
                    backgroundColor: currentTheme.background.secondary,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: `${stock.percentage}%`,
                      backgroundColor: alpha(
                        currentTheme.accent.primary,
                        currentTheme.name === "Dark Theme" ? 0.4 : 0.2
                      ),
                    }}
                  />
                  <Avatar
                    sx={{
                      bgcolor: currentTheme.accent.primary,
                      mr: 2,
                      zIndex: 1,
                    }}
                  >
                    {initials}
                  </Avatar>
                  <Typography
                    sx={{ color: currentTheme.text.primary, zIndex: 1 }}
                  >
                    {displayName}
                  </Typography>
                  <Typography
                    sx={{
                      ml: "auto",
                      color: currentTheme.text.primary,
                      zIndex: 1,
                    }}
                  >
                    {stock.percentage.toFixed(2)}%
                  </Typography>
                </Box>
              );
            })}
          </Stack>
          <Box
            sx={{
              mt: 4,
              height: chartDimensions.height,
              fontSize: chartDimensions.fontSize,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              {renderPieChartContent()}
            </ResponsiveContainer>
          </Box>
        </Box>
      ) : (
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ width: "100%" }}
        >
          <Box
            sx={{
              flex: "0 0 60%",
              order: { xs: 2, md: 1 },
            }}
          >
            <TableView
              columns={columns}
              tableData={publicPortfolio.portfolioStocks || []}
              isCompact
            />
          </Box>
          <Box
            sx={{
              flex: "0 0 40%",
              order: { xs: 1, md: 2 },
              fontSize: chartDimensions.fontSize,
            }}
          >
            <ResponsiveContainer
              width="100%"
              height={chartDimensions.height}
            >
              {renderPieChartContent()}
            </ResponsiveContainer>
          </Box>
        </Stack>
      )}
    </div>
  );
};
const getPrivacyInfo = (privacy: string) => {
  switch (privacy) {
    case "PRIVATE":
      return { icon: <LockIcon />, text: "Private Portfolio" };
    case "SHARE_ALL":
      return { icon: <PublicIcon />, text: "Showing All Holdings" };
    case "SHARE_SECTORS":
      return { icon: <CategoryIcon />, text: "Showing Sector-wise Holdings" };
    default:
      return { icon: <PublicIcon />, text: "Public Portfolio" };
  }
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
];

export default SharedPortfolio;

const PriceChangeTooltip = ({
  previousPrice,
  previousDate,
  latestPrice,
  latestDate,
  value,
}: {
  previousPrice: number;
  previousDate: string;
  latestPrice: number;
  latestDate: string;
  value: number;
}) => {
  const { currentTheme } = useTheme();
  const formattedValue = formatPerformance(value);

  return (
    <Tooltip
      content={
        <>
          <div style={{ color: currentTheme.text.primary }}>
            {previousDate
              ? `${format(new Date(previousDate), "do MMMM")}: ${previousPrice}`
              : "No historical data"}
          </div>
          <div style={{ color: currentTheme.text.primary }}>
            {latestDate
              ? `${format(new Date(latestDate), "do MMMM")}: ${latestPrice}`
              : "No historical data"}
          </div>
        </>
      }
      position="top"
    >
      {formattedValue}
    </Tooltip>
  );
};

