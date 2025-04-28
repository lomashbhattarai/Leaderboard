import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  IconButton,
  Box,
  useMediaQuery,
  useTheme as useMuiTheme,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BookIcon from "@mui/icons-material/Book";
import UserMenu from "./UserMenu";
import { useTheme } from "../contexts/ThemeContext";
import Logo from "./Logo";

const logoAssetSrc = "/assets/branding/nepse-leader-transparent.png";

// Navbar background color options for branding
const NAVBAR_BG = {
  solidLightGreen: "#e8f5e9", // Light green (default)
  solidDeeperGreen: "#c8e6c9", // Slightly deeper green
  gradient: "linear-gradient(90deg, #e8f5e9 60%, #c8e6c9 100%)", // Subtle gradient
};

const Navbar = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [mobileMenu, setMobileMenu] = React.useState<null | HTMLElement>(null);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const navStyle = {
    "& a": {
      color: currentTheme.text.primary,
      transition: "all 0.2s ease",
      padding: "4px 0",
      position: "relative",
      backgroundColor: currentTheme.background.secondary,
      "&:hover": {
        opacity: 0.8,
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
          backgroundColor: currentTheme.accent.primary,
          animation: "slideIn 0.2s ease-out",
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
    // { to: "/wealth-tracker", label: "Wealth Tracker" },
  ];

  if (isMobile) {
    navLinks = navLinks.slice(0, 4); // Show all items on mobile with icons
  }

  const renderNavLinks = () => (
    <ul
      className="flex space-x-4"
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
                    ? currentTheme.background.primary
                    : "transparent",
                display: "flex",
                alignItems: "center",
                padding: isMobile ? "8px 12px" : "4px 0",
                borderRadius: isMobile ? "4px" : "0",
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
          borderBottom: `1px solid ${currentTheme.background.primary}`,
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: NAVBAR_BG.solidDeeperGreen,
          // background: NAVBAR_BG.gradient,
          backdropFilter: "blur(10px)",
          width: "100%",
          maxWidth: "100vw",
          overflow: "hidden",
          boxShadow: "0 2px 8px 0 rgba(44, 62, 80, 0.07)", // Subtle shadow at the bottom
          ...navStyle,
        }}
      >
        <>
          <div className="flex items-center flex-grow">
            <Link to="/" className="mr-4" style={{ background: "transparent" }}>
              {/* <img
                src={logoAssetSrc}
                alt="Logo"
                className="h-12 w-12 w-auto"
                style={{ background: "transparent" }}
              /> */}
              <Logo />
            </Link>
            <div className="flex flex-grow w-full !px-2 md:px-8 max-w-[1200px] mx-auto">
              {renderNavLinks()}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <UserMenu />
          </div>
        </>
      </Box>

      {/* Mobile Navigation Menu */}
      {/* <Menu
        anchorEl={mobileMenu}
        open={Boolean(mobileMenu)}
        onClose={() => setMobileMenu(null)}
        PaperProps={{
          style: {
            width: "100%",
            maxWidth: "300px",
            marginTop: "8px",
            backgroundColor:
              currentTheme.name === "Default Theme"
                ? "#fff"
                : currentTheme.background.primary,
            color:
              currentTheme.name === "Default Theme"
                ? "rgba(0, 0, 0, 0.87)"
                : "#ffffff",
          },
        }}
        MenuListProps={{
          style: {
            color:
              currentTheme.name === "Default Theme"
                ? "rgba(0, 0, 0, 0.87)"
                : "#ffffff",
            padding: "8px 16px",
          },
        }}
      >
        {isMobile && renderNavLinks()}
      </Menu> */}
    </>
  );
};

export default Navbar;
