import React from "react";
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

const UserMenu: React.FC = () => {
  const { user, logout } = useAuthContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { currentTheme, setTheme, availableThemes } = useTheme();

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
            <MenuItem disabled>{user.name}</MenuItem>
            <MenuItem disabled>{user.email}</MenuItem>
            <MenuItem
              onClick={() => {
                toggleTheme();
                handleClose();
              }}
            >
              Change Theme
              <PaletteIcon
                sx={{
                  ml: 1,
                  color:
                    currentTheme.name === "Default Theme"
                      ? "rgba(0, 0, 0, 0.87)"
                      : "#ffffff",
                  stroke: "rgba(0, 0, 0, 0.87)",
                  strokeWidth: 1,
                }}
              />
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
