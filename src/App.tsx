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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StockProvider>
        <HashRouter>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <CssBaseline />
                <div className="container mx-auto p-4">
                  <nav className="mb-4 flex justify-between items-center">
                    <ul className="flex space-x-4">
                      <li>
                        <Link to="/" className="hover:text-blue-600">
                          Home
                        </Link>
                      </li>
                      {/* <li>
                        <Link
                          to="/earnings-tracker"
                          className="hover:text-blue-600"
                        >
                          Earnings Tracker
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/wealth-tracker"
                          className="hover:text-blue-600"
                        >
                          Wealth Tracker
                        </Link>
                      </li> */}
                      <li>
                        <Link to="/portfolio" className="hover:text-blue-600">
                          Meroshare Portfolio
                        </Link>
                      </li>
                      <li>
                        <Link to="/leaderboard" className="hover:text-blue-600">
                          Portfolio Leaderboard
                        </Link>
                      </li>
                      <li>
                        <Link to="/stocks" className="hover:text-blue-600">
                          Stocks
                        </Link>
                      </li>
                    </ul>
                    <UserMenu />
                  </nav>

                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/" element={<Home />} />
                    <Route
                      path="/portfolio/:id"
                      element={<SharedPortfolio />}
                    />
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
              </LocalizationProvider>
            </ThemeProvider>
          </AuthProvider>
        </HashRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </StockProvider>
    </QueryClientProvider>
  );
}

// Create a simple Home component
function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to the Leaderboard</h1>
      <p>Choose an option from the navigation menu above.</p>

      {/* <div>TODO - wealth tracker</div>
      <div>Tax calculator</div>
      <div>Expense management</div>
      <div>Feature request</div>
      <div>Books: to be read</div>
      <div>Books: recommended</div> */}
    </div>
  );
}

export default App;
