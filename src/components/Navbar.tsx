import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Box,
  useMediaQuery,
  useTheme as useMuiTheme,
  Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BookIcon from "@mui/icons-material/Book";
import UserMenu from "./UserMenu";
import { useTheme } from "../contexts/ThemeContext";
import { useAuthContext } from "../contexts/AuthContext";
import Logo from "./Logo";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const Navbar = () => {
  const { currentTheme } = useTheme();
  const { user } = useAuthContext();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  
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

  let navLinks = [
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
    { to: "/wealth-tracker", label: "Wealth Tracker" },
  ];

  // Add admin dashboard link for admin users
  if (isAdmin) {
    navLinks.push({
      to: "/admin/dashboard",
      label: "Admin",
      icon: <AdminPanelSettingsIcon />,
    });
  }

  if (isMobile) {
    navLinks = navLinks.slice(0, 5); // Show all items on mobile with icons
  }

  const renderNavLinks = () => (
    <ul
      className="flex space-x-0 sm:space-x-2"
      style={{
        color: currentTheme.text.primary,
      }}
    >
      {navLinks.map((link) => (
        <li key={link.to}>
          <Tooltip title={isMobile ? link.label : ""} placement="right">
            <NavLink
              to={link.to}
              style={({ isActive }) => ({
                color: currentTheme.text.primary,
                backgroundColor:
                  isActive && isMobile
                    ? currentTheme.surface.inset
                    : "transparent",
                display: "flex",
                alignItems: "center",
                padding: isMobile ? "8px 10px" : "8px 10px",
                borderRadius: currentTheme.shape.borderRadius,
                fontWeight: isActive ? 650 : 550,
              })}
            >
              {isMobile ? (
                <span style={{ marginRight: "8px" }}>{link.icon}</span>
              ) : (
                link.label
              )}
            </NavLink>
          </Tooltip>
        </li>
      ))}
    </ul>
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
        <>
          <div className="flex items-center flex-grow">
            {!isMobile && (
              <Link
                to="/"
                className="mr-4"
                style={{ background: "transparent" }}
              >
                {/* <img
                src={logoAssetSrc}
                alt="Logo"
                className="h-12 w-12 w-auto"
                style={{ background: "transparent" }}
              /> */}
                <Logo />
              </Link>
            )}

            <div className="flex flex-grow w-full !px-2 md:px-8 max-w-[1200px] mx-auto">
              {renderNavLinks()}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <UserMenu />
          </div>
        </>
      </Box>
    </>
  );
};

export default Navbar;
