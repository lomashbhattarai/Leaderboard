import React from "react";
import { Link } from "react-router-dom";
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
      transition: "color 0.2s ease",
      "&:hover": {
        opacity: 0.8,
        color: currentTheme.accent.primary,
      },
    },
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/portfolio", label: "Meroshare Portfolio" },
    { to: "/stocks", label: "Stocks" },
    { to: "/earnings-tracker", label: "Earnings Tracker" },
    { to: "/wealth-tracker", label: "Wealth Tracker" },
  ];

  const renderNavLinks = () => (
    <ul
      className={`${isMobile ? "flex flex-col space-y-2" : "flex space-x-4"}`}
      style={{
        color:
          currentTheme.name === "Default Theme"
            ? "rgba(0, 0, 0, 0.87)"
            : "#ffffff",
      }}
    >
      {navLinks.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            onClick={() => isMobile && setMobileMenu(null)}
            style={{
              color:
                currentTheme.name === "Default Theme"
                  ? "rgba(0, 0, 0, 0.87)"
                  : "#ffffff",
            }}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <Box
        component="nav"
        className="mb-4 flex justify-between items-center w-full"
        sx={navStyle}
      >
        {isMobile ? (
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
        ) : (
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
        )}
      </Box>

      {/* Mobile Navigation Menu */}
      <Menu
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
          },
        }}
      >
        {isMobile && renderNavLinks()}
      </Menu>

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
