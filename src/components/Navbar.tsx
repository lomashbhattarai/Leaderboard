import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BookIcon from "@mui/icons-material/Book";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import UserMenu from "./UserMenu";
import { useTheme } from "../contexts/ThemeContext";
import { useAuthContext } from "../contexts/AuthContext";
import Logo from "./Logo";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

type NavLinkItem = {
  to: string;
  label: string;
  mobileLabel?: string;
  icon: React.ReactNode;
};

const Navbar = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuthContext();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate = useNavigate();
  const [moreAnchorEl, setMoreAnchorEl] = React.useState<null | HTMLElement>(
    null
  );

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const navStyle = {
    "& a": {
      color: currentTheme.text.primary,
      transition: `color ${currentTheme.motion.base} ${currentTheme.motion.easing}, background-color ${currentTheme.motion.base} ${currentTheme.motion.easing}`,
      position: "relative",
      "&:hover": {
        color: currentTheme.accent.primary,
      },
      "&.active": {
        color: currentTheme.accent.primary,
        "&:after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          borderRadius: "999px",
          backgroundColor: currentTheme.accent.primary,
          animation: `slideIn ${currentTheme.motion.fast} ${currentTheme.motion.easing}`,
        },
      },
    },
    "@keyframes slideIn": {
      from: { transform: "scaleX(0)" },
      to: { transform: "scaleX(1)" },
    },
  };

  const navLinks: NavLinkItem[] = [
    { to: "/", label: "Home", icon: <HomeIcon /> },
    {
      to: "/my-portfolio",
      label: "Portfolio",
      icon: <AccountBalanceWalletIcon />,
    },
    { to: "/stocks", label: "Stocks", icon: <TrendingUpIcon /> },
    {
      to: "/leaderboard",
      label: "Leaderboard",
      icon: <EmojiEventsIcon />,
    },
    {
      to: "/journals",
      label: "Journals",
      icon: <BookIcon />,
    },
    // { to: "/earnings-tracker", label: "Earnings Tracker" },
    {
      to: "/wealth-tracker",
      label: "Wealth Tracker",
      mobileLabel: "Wealth",
      icon: <ShowChartIcon />,
    },
  ];

  // Add admin dashboard link for admin users
  if (isAdmin) {
    navLinks.push({
      to: "/admin/dashboard",
      label: "Admin",
      icon: <AdminPanelSettingsIcon />,
    });
  }

  const mobilePrimaryLinks = navLinks.filter((link) =>
    ["/", "/my-portfolio", "/wealth-tracker", "/stocks"].includes(link.to)
  );
  const mobileMoreLinks = navLinks.filter(
    (link) => !mobilePrimaryLinks.some((primary) => primary.to === link.to)
  );
  const activeMobileValue = mobilePrimaryLinks.some(
    (link) => link.to === location.pathname
  )
    ? location.pathname
    : mobileMoreLinks.some((link) => link.to === location.pathname)
    ? "more"
    : false;

  const openMoreMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMoreAnchorEl(event.currentTarget);
  };

  const closeMoreMenu = () => {
    setMoreAnchorEl(null);
  };

  const openMoreLink = (to: string) => {
    navigate(to);
    closeMoreMenu();
  };

  const renderNavLinks = () => (
    <ul
      className="flex space-x-2"
      style={{
        color: currentTheme.text.primary,
      }}
    >
      {navLinks.map((link) => (
        <li key={link.to}>
          <NavLink
            to={link.to}
            style={({ isActive }) => ({
              color: currentTheme.text.primary,
              backgroundColor: "transparent",
              display: "flex",
              alignItems: "center",
              padding: "8px 10px",
              borderRadius: currentTheme.shape.borderRadius,
              fontWeight: isActive ? 650 : 550,
              whiteSpace: "nowrap",
            })}
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  const renderMobileBottomNav = () => (
    <>
      <Box
        component="nav"
        aria-label="Mobile primary navigation"
        sx={{
          display: { xs: "flex", sm: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2147483000,
          height: "calc(64px + env(safe-area-inset-bottom))",
          pb: "env(safe-area-inset-bottom)",
          borderTop: `1px solid ${currentTheme.border.subtle}`,
          background: currentTheme.surface.nav,
          backdropFilter: "blur(18px)",
          boxShadow: currentTheme.shadow.md,
          alignItems: "stretch",
        }}
      >
        {mobilePrimaryLinks.map((link) => (
          <Box
            key={link.to}
            component={NavLink}
            to={link.to}
            aria-label={link.mobileLabel || link.label}
            sx={{
              flex: "1 1 0",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.25,
              color:
                activeMobileValue === link.to
                  ? currentTheme.accent.primary
                  : currentTheme.text.secondary,
              textDecoration: "none",
              fontSize: "0.68rem",
              fontWeight: activeMobileValue === link.to ? 750 : 650,
              "& svg": { fontSize: 22 },
            }}
          >
            {link.icon}
            <Box component="span" sx={{ whiteSpace: "nowrap" }}>
              {link.mobileLabel || link.label}
            </Box>
          </Box>
        ))}
        <Box
          component="button"
          type="button"
          aria-label="More"
          onClick={openMoreMenu}
          sx={{
            flex: "1 1 0",
            minWidth: 0,
            border: 0,
            background: "transparent",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.25,
            color:
              activeMobileValue === "more"
                ? currentTheme.accent.primary
                : currentTheme.text.secondary,
            fontFamily: "inherit",
            fontSize: "0.68rem",
            fontWeight: activeMobileValue === "more" ? 750 : 650,
            cursor: "pointer",
            "& svg": { fontSize: 22 },
          }}
        >
          <MoreHorizIcon />
          <Box component="span">More</Box>
        </Box>
      </Box>
      <Menu
        anchorEl={moreAnchorEl}
        open={Boolean(moreAnchorEl)}
        onClose={closeMoreMenu}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ zIndex: 2147483001 }}
      >
        {mobileMoreLinks.map((link) => (
          <MenuItem key={link.to} onClick={() => openMoreLink(link.to)}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              {link.icon}
              {link.label}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  return (
    <>
      <Box
        component="nav"
        className="flex justify-between items-center w-full"
        sx={{
          padding: "0.5rem 1rem",
          borderBottom: `1px solid ${currentTheme.border.subtle}`,
          color: currentTheme.text.primary,
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: currentTheme.surface.nav,
          backdropFilter: "blur(18px)",
          width: "100%",
          maxWidth: "100vw",
          overflow: "hidden",
          boxShadow: currentTheme.shadow.sm,
          ...navStyle,
        }}
      >
        <div className="flex items-center flex-grow min-w-0">
          <Link
            to="/"
            className={isMobile ? "" : "mr-4"}
            style={{ background: "transparent" }}
          >
            <Logo />
          </Link>

          {!isMobile && (
            <div className="flex flex-grow w-full !px-2 md:px-8 max-w-[1200px] mx-auto overflow-x-auto">
              {renderNavLinks()}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <UserMenu />
        </div>
      </Box>
      {isMobile && renderMobileBottomNav()}
    </>
  );
};

export default Navbar;
