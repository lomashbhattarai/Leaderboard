import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import MenuIcon from "@mui/icons-material/Menu";
import UserMenu from "./UserMenu";
import { useTheme } from "../contexts/ThemeContext";
import { spaceThemes } from "../themes/spaceThemes";

const Navbar = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [themeMenu, setThemeMenu] = React.useState<null | HTMLElement>(null);
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
    { to: "/earnings-tracker", label: "Earnings Tracker" },
    { to: "/wealth-tracker", label: "Wealth Tracker" },
  ];

  if (isMobile) {
    navLinks = navLinks.slice(0, 2);
  }

  const renderNavLinks = () => (
    <ul
      className={`${
        isMobile && false ? "flex flex-col space-y-2" : "flex space-x-4"
      }`}
      style={{
        color:
          currentTheme.name === "Default Theme"
            ? "rgba(0, 0, 0, 0.87)"
            : "#ffffff",
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
                  : "#ffffff",
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
    </>
  );

  return (
    <>
      <Box
        component="nav"
        className="mb-4 flex justify-between items-center w-full"
        sx={navStyle}
      >
        <>
          <div className="flex-1 min-w-0">{renderNavLinks()}</div>
          <div className="flex items-center space-x-2 ml-4">
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

      {/* Theme Menu */}
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
    </>
  );
};

export default Navbar;
