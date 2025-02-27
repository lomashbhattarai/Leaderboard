import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  IconButton,
  Box,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import UserMenu from "./UserMenu";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [mobileMenu, setMobileMenu] = React.useState<null | HTMLElement>(null);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const navStyle = {
    "& a": {
      color:
        currentTheme.name === "Default Theme"
          ? "rgba(0, 0, 0, 0.87)"
          : "#ffffff",
      transition: "all 0.2s ease",
      padding: "4px 0",
      position: "relative",
      backgroundColor:
        currentTheme.name === "Default Theme"
          ? "rgba(240, 237, 238, 0.8)" // Tailwind gray-100
          : "rgba(0, 0, 0, 0.8)",
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
    { to: "/", label: "Home" },
    { to: "/my-portfolio", label: "My Portfolio" },
    { to: "/stocks", label: "Stocks" },
    // { to: "/earnings-tracker", label: "Earnings Tracker" },
    // { to: "/wealth-tracker", label: "Wealth Tracker" },
  ];

  if (isMobile) {
    navLinks = navLinks.slice(0, 3);
  }

  const renderNavLinks = () => (
    <ul
      className={`${
        isMobile && false ? "flex flex-col space-y-2" : "flex space-x-4"
      }`}
      style={{
        color: currentTheme.name === "Default Theme" ? "blue" : "#ffffff",
      }}
    >
      {navLinks.map((link) => (
        <li key={link.to}>
          <NavLink
            to={link.to}
            onClick={() => isMobile && false && setMobileMenu(null)}
            style={({ isActive }) => ({
              color:
                currentTheme.name === "Default Theme"
                  ? "rgba(0, 0, 0, 0.87)"
                  : currentTheme.accent.primary,
              backgroundColor:
                isActive && isMobile && false
                  ? currentTheme.name === "Default Theme"
                    ? "rgba(0, 0, 0, 0.04)"
                    : "rgba(255, 255, 255, 0.08)"
                  : "transparent",
              display: "block",
              padding: isMobile && false ? "8px 12px" : "4px 0",
              borderRadius: isMobile && false ? "4px" : "0",
            })}
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  const menuForMobile = (
    <>
      <IconButton
        onClick={(e) => setMobileMenu(e.currentTarget)}
        style={{
          color:
            currentTheme.name === "Default Theme"
              ? "rgba(0, 0, 0, 0.87)"
              : "#ffffff",
        }}
      >
        <MenuIcon />
      </IconButton>
      <div className="flex items-center space-x-2">
        <UserMenu />
      </div>
    </>
  );

  return (
    <>
      <Box
        component="nav"
        className="flex justify-between items-center w-full"
        sx={{
          padding: "0.5rem 1rem",
          background:
            currentTheme.name === "Default Theme"
              ? "linear-gradient(to right, rgba(0, 0, 255, 0.07), rgba(0, 0, 255, 0.03), rgba(0, 0, 255, 0.01))"
              : "rgba(0, 0, 0, 0.2)",
          ...navStyle,
        }}
      >
        <>
          <div className="flex items-center flex-grow">
            <Link to="/" className="mr-4" style={{ background: "transparent" }}>
              <img
                src="/assets/branding/nepse-leader-transparent.png"
                alt="Logo"
                className="h-12 w-12 w-auto"
                style={{ background: "transparent" }}
              />
            </Link>
            <div className="flex flex-grow w-full px-2 md:px-8 max-w-[1200px] mx-auto">
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
