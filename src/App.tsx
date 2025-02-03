import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import EarningsTracker from "./pages/EarningsTracker";
import Portfolio from "./pages/Portfolio";
import Leaderboard from "./pages/Leaderboard";
import WealthTracker from "./pages/WealthTracker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Stocks from "./pages/Stocks";
import StockDetail from "./pages/StockDetail";
import SharedPortfolio from "./pages/SharedPortfolio";
import { StockProvider } from "./contexts/StockContext";
import UserMenu from "./components/UserMenu";
import { ThemeProvider as SpaceThemeProvider } from "./contexts/ThemeContext";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTheme } from "./contexts/ThemeContext";
import SpaceBackground from "./components/SpaceBackground";
import { alpha } from "@mui/material/styles";
import { IconButton, Menu, MenuItem, Box } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import React from "react";
import { spaceThemes } from "./themes/spaceThemes";

const theme = createTheme();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const AppContent = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [themeMenu, setThemeMenu] = React.useState<null | HTMLElement>(null);

  const navStyle = {
    "& a": {
      // This will target all Links inside nav
      color:
        currentTheme.name === "Default Theme"
          ? "rgba(0, 0, 0, 0.87)"
          : "#ffffff",
      transition: "color 0.2s ease",
      "&:hover": {
        opacity: 0.8,
        color: currentTheme.accent.primary,
      },
    },
  };

  const content = (
    <>
      <SpaceBackground theme={currentTheme} />
      <div className="container mx-auto p-4">
        <Box
          component="nav"
          className="mb-4 flex justify-between items-center"
          sx={navStyle}
        >
          <ul className="flex space-x-4">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/portfolio">Meroshare Portfolio</Link>
            </li>
            {/* <li>
              <Link to="/leaderboard">NEPSE Leaderboard</Link>
            </li> */}
            <li>
              <Link to="/stocks">Stocks</Link>
            </li>
            <li>
              <Link to="/earnings-tracker">Earnings Tracker</Link>
            </li>
            <li>
              <Link to="/wealth-tracker">Wealth Tracker</Link>
            </li>
          </ul>
          <div className="flex items-center space-x-2">
            <IconButton
              onClick={(e) => setThemeMenu(e.currentTarget)}
              style={{
                color:
                  currentTheme.name === "Default Theme"
                    ? "rgba(0, 0, 0, 0.87)"
                    : "#ffffff",
              }}
            >
              <PaletteIcon />
            </IconButton>
            <UserMenu />
          </div>
        </Box>

        <Menu
          anchorEl={themeMenu}
          open={Boolean(themeMenu)}
          onClose={() => setThemeMenu(null)}
        >
          {availableThemes.map((themeName) => (
            <MenuItem
              key={themeName}
              onClick={() => {
                setTheme(themeName);
                setThemeMenu(null);
              }}
            >
              {spaceThemes[themeName].name}
            </MenuItem>
          ))}
        </Menu>

        <Routes>
          {/* <Route path="/" element={<Leaderboard />} /> */}
          <Route path="/" element={<Leaderboard />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/portfolio/:id" element={<SharedPortfolio />} />
          <Route
            path="/wealth-tracker"
            element={
              <ProtectedRoute>
                <WealthTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/earnings-tracker"
            element={
              <ProtectedRoute>
                <EarningsTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            }
          />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/stock/:symbol" element={<StockDetail />} />
        </Routes>
      </div>
    </>
  );

  const containerStyle = {
    color: currentTheme.accent.primary,
    backdropFilter: "blur(10px)",
  };

  return (
    <>
      <SpaceBackground theme={currentTheme} />
      {currentTheme.name === "Default Theme" ? (
        <div className="container mx-auto p-4">{content}</div>
      ) : (
        <div style={containerStyle}>
          <div className="container mx-auto p-4">{content}</div>
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <StockProvider>
          <HashRouter>
            <AuthProvider>
              <SpaceThemeProvider>
                <ThemeProvider theme={theme}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <CssBaseline />
                    <AppContent />
                  </LocalizationProvider>
                </ThemeProvider>
              </SpaceThemeProvider>
            </AuthProvider>
          </HashRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </StockProvider>
      </QueryClientProvider>
    </MuiThemeProvider>
  );
}

// Create a simple Home component
function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to NEPSE Leader</h1>
      <p>Choose an option from the navigation menu above.</p>
      {/* <div>TODO - wealth tracker</div>
      <div>Tax calculator</div>
      <div>Expense management</div>
      <div>Feature request</div>
      <div>Books: to be read</div>
      <div>Books: recommended</div> */}
      <strong>New Features Coming Soon:</strong>
      <ul>
        <li>Set stop loss for a stock (auto sell)</li>
        <li>Set target price for a stock (auto buy/sell)</li>
        <li>tags for stocks</li>
        <li> communtiy</li>
        <li> Set portfolio to private/public</li>
        <li> pay to view portfolio</li>
      </ul>
    </div>
  );
}

export default App;
