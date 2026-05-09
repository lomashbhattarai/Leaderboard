import React from "react";
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import BookIcon from "@mui/icons-material/Book";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Link as RouterLink } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

type DemoFeature = {
  title: string;
  eyebrow: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  demo: React.ReactNode;
};

const PortfolioDemo = () => (
  <Box sx={{ display: "grid", gap: 1 }}>
    {[
      { symbol: "NABIL", value: "Rs 412K", change: "+3.8%" },
      { symbol: "NICA", value: "Rs 268K", change: "+1.4%" },
      { symbol: "SHIVM", value: "Rs 193K", change: "-0.6%" },
    ].map((stock, index) => (
      <Box
        key={stock.symbol}
        sx={{
          display: "grid",
          gridTemplateColumns: "54px 1fr auto",
          alignItems: "center",
          gap: 1.25,
          minHeight: 42,
          px: 1.25,
          border: "1px solid var(--app-border-subtle)",
          backgroundColor: "var(--app-surface)",
          animation: `landingRowFloat 4.8s ${index * 0.25}s infinite var(--app-motion-easing)`,
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 800 }}>
          {stock.symbol}
        </Typography>
        <Box
          sx={{
            height: 8,
            backgroundColor: "var(--app-surface-inset)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: index === 0 ? "78%" : index === 1 ? "55%" : "38%",
              height: "100%",
              backgroundColor:
                index === 2 ? "var(--app-warning)" : "var(--app-positive)",
              animation: `landingBarGrow 4.8s ${index * 0.25}s infinite var(--app-motion-easing)`,
            }}
          />
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" sx={{ display: "block", fontWeight: 700 }}>
            {stock.value}
          </Typography>
          <Typography
            variant="caption"
            className={stock.change.startsWith("+") ? "text-app-positive" : "text-app-negative"}
            sx={{ fontWeight: 700 }}
          >
            {stock.change}
          </Typography>
        </Box>
      </Box>
    ))}
  </Box>
);

const WealthDemo = () => (
  <Box>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
      <Box>
        <Typography variant="caption" color="text.secondary">
          Total wealth
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
          Rs 1.42M
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
        5 yr projection
      </Typography>
    </Stack>
    <Box
      sx={{
        position: "relative",
        height: 118,
        border: "1px solid var(--app-border-subtle)",
        background:
          "linear-gradient(180deg, rgba(0, 140, 255, 0.1), rgba(52, 199, 89, 0.08))",
        overflow: "hidden",
        p: 1.25,
      }}
    >
      {[0, 1, 2, 3].map((line) => (
        <Box
          key={line}
          sx={{
            position: "absolute",
            left: 12,
            right: 12,
            bottom: 18 + line * 22,
            height: 1,
            backgroundColor: "var(--app-border-subtle)",
          }}
        />
      ))}
      <svg
        aria-hidden="true"
        viewBox="0 0 220 92"
        width="100%"
        height="92"
        preserveAspectRatio="none"
        style={{ position: "relative", display: "block" }}
      >
        <path
          d="M6 78 C44 72, 58 62, 82 57 C116 50, 124 36, 151 30 C177 24, 190 14, 214 8"
          fill="none"
          stroke="var(--app-accent-2)"
          strokeWidth="4"
          strokeLinecap="round"
          style={{
            strokeDasharray: 260,
            animation: "landingProjectionTrace 4.8s infinite var(--app-motion-easing)",
          }}
        />
        <path
          d="M6 78 C44 72, 58 62, 82 57 C116 50, 124 36, 151 30 C177 24, 190 14, 214 8 L214 92 L6 92 Z"
          fill="var(--app-accent-2)"
          opacity="0.12"
        />
      </svg>
    </Box>
    <Stack direction="row" spacing={0.75} sx={{ mt: 1, flexWrap: "wrap", rowGap: 0.75 }}>
      {[
        { label: "Stocks 54%", color: "var(--app-accent)" },
        { label: "Cash 18%", color: "var(--app-accent-2)" },
        { label: "Assets 28%", color: "var(--app-accent-3)" },
      ].map((item) => (
        <Chip
          key={item.label}
          size="small"
          label={item.label}
          sx={{
            border: "1px solid var(--app-border-subtle)",
            backgroundColor: "var(--app-surface)",
            "& .MuiChip-label": { fontSize: "0.68rem", fontWeight: 700 },
            "&:before": {
              content: '""',
              width: 8,
              height: 8,
              backgroundColor: item.color,
              marginLeft: "8px",
            },
          }}
        />
      ))}
    </Stack>
  </Box>
);

const JournalDemo = () => (
  <Box sx={{ display: "grid", gap: 1.1 }}>
    <Box
      sx={{
        border: "1px solid var(--app-border-subtle)",
        backgroundColor: "var(--app-surface)",
        p: 1.25,
        minHeight: 106,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Chip size="small" label="NABIL" />
        <Chip size="small" label="discipline" />
      </Stack>
      <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.75 }}>
        Buy thesis
      </Typography>
      <Box sx={{ display: "grid", gap: 0.75 }}>
        {["Dividend history is still strong.", "Wait for price near support."].map((line, index) => (
          <Typography
            key={line}
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              width: index === 0 ? "92%" : "74%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              animation: `landingTextReveal 5s ${index * 0.55}s infinite steps(32, end)`,
            }}
          >
            {line}
          </Typography>
        ))}
      </Box>
    </Box>
    <Typography variant="caption" color="text.secondary">
      Connected to your stock decisions, not scattered in a notes app.
    </Typography>
  </Box>
);

const features: DemoFeature[] = [
  {
    title: "Manage your NEPSE portfolio",
    eyebrow: "Portfolio",
    description:
      "Import holdings, watch allocation, and understand what is carrying your returns.",
    icon: <AccountBalanceWalletIcon fontSize="small" />,
    accent: "var(--app-accent)",
    demo: <PortfolioDemo />,
  },
  {
    title: "Track your wealth",
    eyebrow: "Wealth",
    description:
      "Bring stocks, cash, liabilities, and long-term progress into one clear view.",
    icon: <AutoGraphIcon fontSize="small" />,
    accent: "var(--app-accent-2)",
    demo: <WealthDemo />,
  },
  {
    title: "Journal your thoughts",
    eyebrow: "Journal",
    description:
      "Capture trade notes, investing rules, and lessons while the context is fresh.",
    icon: <BookIcon fontSize="small" />,
    accent: "var(--app-accent-3)",
    demo: <JournalDemo />,
  },
];

const LandingHero = () => {
  const { currentTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const isCompact = useMediaQuery(muiTheme.breakpoints.down("md"));

  return (
    <Box
      data-testid="signed-out-landing"
      sx={{
        mb: 5,
        "@keyframes landingRowFloat": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "@keyframes landingBarGrow": {
          "0%, 100%": { transform: "scaleX(0.84)", transformOrigin: "left center" },
          "50%": { transform: "scaleX(1)", transformOrigin: "left center" },
        },
        "@keyframes landingBarBounce": {
          "0%, 100%": { transform: "scaleY(0.72)", transformOrigin: "bottom center" },
          "50%": { transform: "scaleY(1)", transformOrigin: "bottom center" },
        },
        "@keyframes landingProjectionTrace": {
          "0%": { strokeDashoffset: 260 },
          "45%, 100%": { strokeDashoffset: 0 },
        },
        "@keyframes landingTextReveal": {
          "0%, 12%": { maxWidth: 0 },
          "42%, 100%": { maxWidth: "100%" },
        },
      }}
    >
      <Box
        component="section"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.92fr) minmax(420px, 1.08fr)" },
          gap: { xs: 3, md: 4 },
          alignItems: "center",
          minHeight: { xs: "auto", md: "calc(100vh - 190px)" },
          pb: { xs: 1, md: 3 },
        }}
      >
        <Box>
          <Chip
            icon={<TrendingUpIcon />}
            label="Built for Nepal's market"
            sx={{
              mb: 2,
              backgroundColor: currentTheme.surface.inset,
              color: currentTheme.text.primary,
              border: `1px solid ${currentTheme.border.subtle}`,
              fontWeight: 700,
            }}
          />
          <Typography
            variant={isCompact ? "h3" : "h2"}
            component="h1"
            sx={{
              fontWeight: 850,
              lineHeight: 0.98,
              maxWidth: 620,
              mb: 2,
            }}
          >
            Your investing dashboard for NEPSE, wealth, and decisions.
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 560, mb: 3, fontSize: { md: "1.05rem" } }}
          >
            Nepse Leader helps you follow portfolio performance, track your
            broader net worth, and keep a decision journal that makes every
            trade easier to review later.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                alignSelf: { xs: "stretch", sm: "flex-start" },
                backgroundColor: currentTheme.accent.primary,
                px: 2.5,
                py: 1.1,
                "&:hover": { backgroundColor: currentTheme.accent.secondary },
              }}
            >
              Start tracking
            </Button>
            <Button
              component={RouterLink}
              to="/leaderboard"
              variant="outlined"
              sx={{
                alignSelf: { xs: "stretch", sm: "flex-start" },
                px: 2.5,
                py: 1.1,
              }}
            >
              View leaderboard
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))", md: "1fr" },
            gap: 1.5,
          }}
        >
          {features.map((feature) => (
            <Box
              key={feature.title}
              sx={{
                border: `1px solid ${currentTheme.border.subtle}`,
                backgroundColor: currentTheme.surface.overlay,
                boxShadow: currentTheme.shadow.sm,
                backdropFilter: "blur(16px)",
                p: { xs: 1.5, md: 1.75 },
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.86fr) minmax(220px, 1fr)" },
                gap: 1.5,
                alignItems: "center",
                minHeight: { xs: "auto", md: 174 },
              }}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      display: "grid",
                      placeItems: "center",
                      backgroundColor: feature.accent,
                      color: "var(--app-text-inverse)",
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                    {feature.eyebrow}
                  </Typography>
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.05, mb: 0.75 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
              <Box>{feature.demo}</Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LandingHero;
