import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useAuthContext } from "../contexts/AuthContext";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import PaletteIcon from "@mui/icons-material/Palette";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  useUserSettings,
  useToggleAnonymous,
} from "../api/queries/useUserSettings";
import { showToast } from "../utils/toast";
import { useShowAmounts } from "../contexts/ShowAmountsContext";

const UserMenu: React.FC = () => {
  const { user, logout } = useAuthContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { currentTheme, setTheme, availableThemes } = useTheme();

  const { data: settings } = useUserSettings();
  const toggleAnonymousMutation = useToggleAnonymous();
  const { showAmounts, toggleShowAmounts } = useShowAmounts();

  const navigate = useNavigate();

  const toggleTheme = () => {
    const currentIndex = availableThemes.indexOf(currentTheme.name);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    setTheme(availableThemes[nextIndex]);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleAnonymous = async () => {
    try {
      await toggleAnonymousMutation.mutateAsync();
      showToast.success(
        settings?.isAnonymous
          ? "Identity revealed! Time to be as bold as Tony Stark at a press conference 🎤"
          : "Gone incognito! Even Batman would approve of your discretion 🦇"
      );
      handleClose();
    } catch (error) {
      console.error("Failed to toggle anonymous mode:", error);
      showToast.error("Failed to toggle anonymous mode.");
    }
  };

  return (
    <>
      {user ? (
        <div>
          <Tooltip title="Account settings">
            <IconButton onClick={handleMenu} size="small">
              <Avatar>
                {user.fullName
                  ?.split(" ")
                  .map((name: string) => name[0])
                  .join("")}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>
              {settings?.isAnonymous ? "Anonymous User" : user.fullName}
            </MenuItem>
            <MenuItem disabled>{user.email}</MenuItem>
            <MenuItem onClick={handleToggleAnonymous}>
              {settings?.isAnonymous ? "Show Identity" : "Go Anonymous"}
              {settings?.isAnonymous ? (
                <VisibilityIcon sx={{ ml: 1 }} />
              ) : (
                <VisibilityOffIcon sx={{ ml: 1 }} />
              )}
            </MenuItem>
            <MenuItem
              onClick={() => {
                toggleShowAmounts();
                handleClose();
              }}
            >
              {showAmounts ? "Mask Amounts" : "Unmask Amounts"}
              {showAmounts ? (
                <VisibilityOffIcon sx={{ ml: 1 }} />
              ) : (
                <VisibilityIcon sx={{ ml: 1 }} />
              )}
            </MenuItem>
            <MenuItem
              onClick={() => {
                logout();
                handleClose();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      ) : (
        <div>
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: currentTheme.accent.primary,
              "&:hover": {
                backgroundColor: currentTheme.accent.secondary,
              },
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      )}
    </>
  );
};

export default UserMenu;
