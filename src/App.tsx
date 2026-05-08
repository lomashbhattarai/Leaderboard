import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useMemo } from "react";
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
import { useTheme } from "./contexts/ThemeContext";
import SpaceBackground from "./components/SpaceBackground";
import Navbar from "./components/Navbar";
import StopLossPage from "./pages/StopLossPage";
import { Toaster } from "react-hot-toast";
import NewPortfolio from "./pages/NewPortfolio";
import Journals from "./pages/Journals";
import TransactionHistory from "./pages/TransactionHistory";
import AdminDashboard from "./pages/AdminDashboard";
import { WatchListProvider } from "./contexts/WatchListContext";
import { ShowAmountsProvider } from "./contexts/ShowAmountsContext";
import { buildMuiTheme, cssVariablesFromTheme } from "./themes/designTokens";

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
  const muiTheme = useMemo(() => buildMuiTheme(currentTheme), [currentTheme]);
  const themeVars = useMemo(
    () => cssVariablesFromTheme(currentTheme),
    [currentTheme]
  );

  const content = (
    <div
      className="relative min-h-screen flex flex-col app-shell"
      style={themeVars}
    >
      <SpaceBackground theme={currentTheme} />
      <div className="relative flex-1 flex flex-col">
        <Toaster position="top-right" />
        <Navbar />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
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
            <Route
              path="/portfolio/:portfolioId/transactions"
              element={
                <ProtectedRoute>
                  <TransactionHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {content}
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StockProvider>
        <HashRouter>
          <AuthProvider>
            <SpaceThemeProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <WatchListProvider>
                  <ShowAmountsProvider>
                    <AppContent />
                  </ShowAmountsProvider>
                </WatchListProvider>
              </LocalizationProvider>
            </SpaceThemeProvider>
          </AuthProvider>
        </HashRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </StockProvider>
    </QueryClientProvider>
  );
}

export default App;
