"use client";

import type React from "react";
import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  Edit as EditIcon,
  FileUpload as FileUploadIcon,
  Info as InfoIcon,
  Public as PublicIcon,
  ShowChart as ShowChartIcon,
} from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Create a custom theme with finance-focused colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#10b981", // emerald-500
      light: "#34d399", // emerald-400
      dark: "#059669", // emerald-600
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f43f5e", // red-500
      light: "#fb7185", // red-400
      dark: "#e11d48", // red-600
      contrastText: "#ffffff",
    },
    error: {
      main: "#ef4444", // red-500
    },
    success: {
      main: "#10b981", // emerald-500
    },
    background: {
      default: "#f8fafc", // slate-50
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a", // slate-900
      secondary: "#64748b", // slate-500
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          borderRadius: 12,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "16px",
        },
        head: {
          fontWeight: 600,
          backgroundColor: "#f8fafc", // slate-50
        },
      },
    },
  },
});

// Sample data based on the screenshot
const portfolioStocks = [
  {
    symbol: "GBIME",
    closingPrice: 218.82,
    quantity: 11954,
    valueAtLTP: 2615774.28,
    day: "+0.90%",
    week: "-0.57%",
    month: "-4.86%",
    buyPrice: 239.98,
    stopLoss: "NPR 210.00",
  },
  {
    symbol: "PCBL",
    closingPrice: 251.77,
    quantity: 7250,
    valueAtLTP: 1825332.5,
    day: "-0.04%",
    week: "-0.29%",
    month: "-3.17%",
    buyPrice: 280.71,
    stopLoss: "NPR 233.00",
  },
  {
    symbol: "NTC",
    closingPrice: 900.47,
    quantity: 1000,
    valueAtLTP: 900470.0,
    day: "+1.18%",
    week: "-0.10%",
    month: "-2.55%",
    buyPrice: 911.99,
    stopLoss: null,
  },
  {
    symbol: "NABIL",
    closingPrice: 485.09,
    quantity: 1400,
    valueAtLTP: 679126.0,
    day: "+0.79%",
    week: "-0.46%",
    month: "-3.33%",
    buyPrice: 535.28,
    stopLoss: "NPR 445.00",
  },
  {
    symbol: "SANIMA",
    closingPrice: 300.92,
    quantity: 2000,
    valueAtLTP: 601840.0,
    day: "+0.36%",
    week: "-0.37%",
    month: "-5.22%",
    buyPrice: 299.21,
    stopLoss: null,
  },
  {
    symbol: "BPCL",
    closingPrice: 397.48,
    quantity: 1500,
    valueAtLTP: 596220.0,
    day: "+2.22%",
    week: "+1.68%",
    month: "-4.22%",
    buyPrice: 419.35,
    stopLoss: "NPR 380.00",
  },
  {
    symbol: "PRVU",
    closingPrice: 212.27,
    quantity: 1300,
    valueAtLTP: 275951.0,
    day: "+3.39%",
    week: "-0.56%",
    month: "-8.15%",
    buyPrice: 263.13,
    stopLoss: "NPR 210.00",
  },
  {
    symbol: "SBL",
    closingPrice: 289.62,
    quantity: 900,
    valueAtLTP: 260658.0,
    day: "+4.16%",
    week: "+2.23%",
    month: "-3.75%",
    buyPrice: 372.87,
    stopLoss: "NPR 270.00",
  },
  {
    symbol: "CHCL",
    closingPrice: 488.59,
    quantity: 400,
    valueAtLTP: 195436.0,
    day: "+2.10%",
    week: "-0.54%",
    month: "-9.52%",
    buyPrice: 527.51,
    stopLoss: null,
  },
  {
    symbol: "SAEF",
    closingPrice: 11.25,
    quantity: 10000,
    valueAtLTP: 112500.0,
    day: "+0.00%",
    week: "+0.00%",
    month: "+0.00%",
    buyPrice: 16.21,
    stopLoss: null,
  },
  {
    symbol: "MFIL",
    closingPrice: 614.11,
    quantity: 100,
    valueAtLTP: 61411.0,
    day: "+2.13%",
    week: "-0.53%",
    month: "-4.34%",
    buyPrice: 542.33,
    stopLoss: null,
  },
];

export default function PortfolioPage() {
  const [tabValue, setTabValue] = useState(0);
  const [shareMenuAnchor, setShareMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.down("lg"));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleShareMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShareMenuAnchor(event.currentTarget);
  };

  const handleShareMenuClose = () => {
    setShareMenuAnchor(null);
  };

  const getPerformanceColor = (value: string) => {
    if (value.startsWith("+")) return "success.main";
    if (value.startsWith("-")) return "error.main";
    return "text.secondary";
  };

  const getPerformanceIcon = (value: string) => {
    if (value.startsWith("+"))
      return (
        <ArrowDropUpIcon fontSize="small" sx={{ color: "success.main" }} />
      );
    if (value.startsWith("-"))
      return (
        <ArrowDropDownIcon fontSize="small" sx={{ color: "error.main" }} />
      );
    return null;
  };

  // Portfolio summary data
  const portfolioValue = 8162799.08;
  const initialInvestment = 8897684.42;
  const totalReturn = -8.26;
  const totalReturnValue = -734885.34;
  const dayChange = "+0.47%";
  const dayChangeValue = "+38,080.30";
  const weekChange = "+1.71%";
  const weekChangeValue = "+1,37,329.76";
  const monthChange = "-3.77%";
  const monthChangeValue = "-3,19,580.92";

  // Format number to Indian format
  const formatIndianNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Header */}
        <AppBar
          position="sticky"
          color="default"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Toolbar>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ShowChartIcon color="primary" />
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                StockTracker
              </Typography>
            </Box>

            <Box sx={{ ml: 4, display: { xs: "none", md: "flex" } }}>
              <Button color="inherit" sx={{ mr: 2 }}>
                Home
              </Button>
              <Button
                color="primary"
                sx={{
                  mr: 2,
                  borderBottom: 2,
                  borderColor: "primary.main",
                  borderRadius: 0,
                  pb: 1,
                }}
              >
                My Portfolio
              </Button>
              <Button color="inherit">Stocks</Button>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Avatar sx={{ bgcolor: "grey.300", color: "text.primary" }}>
              LB
            </Avatar>
          </Toolbar>
        </AppBar>

        {/* Main content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Portfolio header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h4" component="h1">
                Fundamental stocks
              </Typography>
              <IconButton size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>

            <Button
              variant="outlined"
              startIcon={<PublicIcon />}
              endIcon={<ArrowDropDownIcon />}
              onClick={handleShareMenuOpen}
            >
              Share All Holdings
            </Button>

            <Menu
              anchorEl={shareMenuAnchor}
              open={Boolean(shareMenuAnchor)}
              onClose={handleShareMenuClose}
            >
              <MenuItem onClick={handleShareMenuClose}>Copy Link</MenuItem>
              <MenuItem onClick={handleShareMenuClose}>
                Share via Email
              </MenuItem>
              <MenuItem onClick={handleShareMenuClose}>Make Private</MenuItem>
            </Menu>
          </Box>

          {/* Portfolio summary cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Current Value
                  </Typography>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: "bold", mb: 0.5 }}
                  >
                    NPR {formatIndianNumber(portfolioValue)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ArrowDropDownIcon sx={{ color: "error.main" }} />
                    <Typography variant="body2" sx={{ color: "error.main" }}>
                      {totalReturn}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Initial Investment
                  </Typography>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: "bold", mb: 0.5 }}
                  >
                    NPR {formatIndianNumber(initialInvestment)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "error.main" }}>
                    NPR {formatIndianNumber(totalReturnValue)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Card>
                <CardContent>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Performance
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            1D
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: getPerformanceColor(dayChange),
                              fontWeight: 500,
                            }}
                          >
                            {dayChange}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ color: getPerformanceColor(dayChange) }}
                        >
                          {dayChangeValue}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            1W
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: getPerformanceColor(weekChange),
                              fontWeight: 500,
                            }}
                          >
                            {weekChange}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ color: getPerformanceColor(weekChange) }}
                        >
                          {weekChangeValue}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            1M
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: getPerformanceColor(monthChange),
                              fontWeight: 500,
                            }}
                          >
                            {monthChange}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ color: getPerformanceColor(monthChange) }}
                        >
                          {monthChangeValue}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Action buttons */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <Button variant="contained" startIcon={<AddIcon />}>
              Add Stock to Portfolio
            </Button>
            <Button variant="outlined" startIcon={<FileUploadIcon />}>
              Upload Meroshare Portfolio CSV
            </Button>
          </Box>

          {/* Portfolio holdings table */}
          <Paper sx={{ mb: 4, overflow: "hidden" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
                py: 2,
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "background.default",
              }}
            >
              <Typography variant="h6">Portfolio Holdings</Typography>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "primary.main",
                  },
                  "& .MuiTab-root": {
                    minWidth: 80,
                    fontSize: "0.875rem",
                  },
                }}
              >
                <Tab label="All" />
                <Tab label="Gainers" />
                <Tab label="Losers" />
              </Tabs>
            </Box>

            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Stock</TableCell>
                    <TableCell align="right">Closing Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Value at LTP</TableCell>
                    <TableCell align="right">1 Day</TableCell>
                    {!isMobile && <TableCell align="right">1 Week</TableCell>}
                    {!isMobile && <TableCell align="right">1 Month</TableCell>}
                    {!isTablet && (
                      <TableCell align="right">Buy Price</TableCell>
                    )}
                    {!isTablet && (
                      <TableCell align="right">Stop Loss</TableCell>
                    )}
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {portfolioStocks.map((stock) => (
                    <TableRow
                      key={stock.symbol}
                      sx={{
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell>
                        <Link
                          href="#"
                          underline="hover"
                          color="primary"
                          sx={{ fontWeight: 500 }}
                        >
                          {stock.symbol}
                        </Link>
                      </TableCell>
                      <TableCell align="right">
                        {stock.closingPrice.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        {stock.quantity.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {formatIndianNumber(stock.valueAtLTP)}
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          {getPerformanceIcon(stock.day)}
                          <Typography
                            variant="body2"
                            sx={{
                              color: getPerformanceColor(stock.day),
                              fontWeight: 500,
                            }}
                          >
                            {stock.day}
                          </Typography>
                        </Box>
                      </TableCell>
                      {!isMobile && (
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            {getPerformanceIcon(stock.week)}
                            <Typography
                              variant="body2"
                              sx={{
                                color: getPerformanceColor(stock.week),
                                fontWeight: 500,
                              }}
                            >
                              {stock.week}
                            </Typography>
                          </Box>
                        </TableCell>
                      )}
                      {!isMobile && (
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            {getPerformanceIcon(stock.month)}
                            <Typography
                              variant="body2"
                              sx={{
                                color: getPerformanceColor(stock.month),
                                fontWeight: 500,
                              }}
                            >
                              {stock.month}
                            </Typography>
                          </Box>
                        </TableCell>
                      )}
                      {!isTablet && (
                        <TableCell align="right">
                          {stock.buyPrice.toFixed(2)}
                        </TableCell>
                      )}
                      {!isTablet && (
                        <TableCell align="right">
                          {stock.stopLoss ? (
                            <Chip
                              label={stock.stopLoss}
                              variant="outlined"
                              size="small"
                            />
                          ) : (
                            <Button
                              variant="text"
                              size="small"
                              sx={{
                                fontSize: "0.75rem",
                                color: "text.secondary",
                                "&:hover": {
                                  color: "primary.main",
                                  bgcolor: "transparent",
                                },
                              }}
                            >
                              Set stop loss
                            </Button>
                          )}
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Tooltip title="Edit stock">
                            <IconButton size="small">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View details">
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
