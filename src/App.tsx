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
import { ThemeProvider as SpaceThemeProvider } from "./contexts/ThemeContext";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTheme } from "./contexts/ThemeContext";
import SpaceBackground from "./components/SpaceBackground";
import Navbar from "./components/Navbar";
import StopLossPage from "./pages/StopLossPage";
import { Toaster } from "react-hot-toast";
import NewPortfolio from "./pages/NewPortfolio";
import Journals from "./pages/Journals";
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
  const { currentTheme } = useTheme();

  const content = (
    <div className="relative min-h-screen flex flex-col">
      <SpaceBackground theme={currentTheme} />
      <div className="relative flex-1 flex flex-col">
        <Toaster position="top-right" />
        <Navbar />
        <div className="flex-1 w-full max-w-[1200px] mx-auto">
          <Routes>
            <Route
              path="/"
              element={<Leaderboard rowLimit={10} isCompact={true} />}
            />
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
              path="/my-portfolio"
              element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-new-portfolio"
              element={
                <ProtectedRoute>
                  <NewPortfolio />
                </ProtectedRoute>
              }
            />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/stock/:symbol" element={<StockDetail />} />
            <Route path="/stop-loss/:stockSymbol" element={<StopLossPage />} />
            <Route
              path="/journals"
              element={
                <ProtectedRoute>
                  <Journals />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );

  const containerStyle = {
    color: currentTheme.accent.primary,
    backdropFilter: "blur(10px)",
  };

  return (
    <>
      <SpaceBackground theme={currentTheme} />
      {currentTheme.name === "Default Theme" ? (
        <div className="w-full ">{content}</div>
      ) : (
        <div style={containerStyle}>{content}</div>
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
      {/* <div>Tax calculator</div>
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
        <li> pay to view portfolio</li>
      </ul>
    </div>
  );
}

export default App;
