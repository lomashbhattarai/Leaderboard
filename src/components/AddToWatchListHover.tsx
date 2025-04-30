import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useWatchListContext } from "../contexts/WatchListContext";
import { showToast } from "../utils/toast";

interface AddToWatchListHoverProps {
  stockId: number;
  children: React.ReactNode;
  alwaysShow?: boolean;
}

const AddToWatchListHover: React.FC<AddToWatchListHoverProps> = ({
  stockId,
  children,
  alwaysShow = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { watchList, addToWatchList, removeFromWatchList } =
    useWatchListContext();

  const isInWatchList = watchList?.some((item) => item.stockId === stockId);
  const watchListEntry = watchList?.find((item) => item.stockId === stockId);

  useEffect(() => {
    if (alwaysShow) {
      setShowButton(true);
      return;
    }
    let timeoutId: NodeJS.Timeout;
    if (isHovered) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [isHovered, alwaysShow]);

  const handleAddToWatchList = async () => {
    try {
      await addToWatchList({ stockId });
      showToast.success("Added to watch list! 👀");
    } catch (error) {
      showToast.error("Failed to add to watch list");
    }
  };

  const handleRemoveFromWatchList = async () => {
    if (!watchListEntry) return;
    try {
      await removeFromWatchList(watchListEntry.id);
      showToast.success("Removed from watch list! 👋");
    } catch (error) {
      showToast.error("Failed to remove from watch list");
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pr: 1.5,
        "&:hover": !alwaysShow
          ? {
              backgroundColor: "action.hover",
              borderRadius: 1,
            }
          : undefined,
      }}
      onMouseEnter={() => !alwaysShow && setIsHovered(true)}
      onMouseLeave={() => !alwaysShow && setIsHovered(false)}
    >
      <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>{children}</Box>
      <Box
        sx={{
          width: 28, // fixed width for icon
          minWidth: 28,
          textAlign: "right",
          opacity: showButton ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
          pointerEvents: showButton ? "auto" : "none",
          ml: 1,
        }}
      >
        {isInWatchList ? (
          <Tooltip title="Remove from watch list">
            <IconButton
              size="small"
              onClick={handleRemoveFromWatchList}
              sx={{
                backgroundColor: "background.paper",
                "&:hover": { backgroundColor: "action.hover" },
                p: 0.5,
                fontSize: 16,
              }}
            >
              <RemoveIcon fontSize="inherit" style={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Add to watch list">
            <IconButton
              size="small"
              onClick={handleAddToWatchList}
              sx={{
                backgroundColor: "background.paper",
                "&:hover": { backgroundColor: "action.hover" },
                p: 0.5,
                fontSize: 16,
              }}
            >
              <AddIcon fontSize="inherit" style={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default AddToWatchListHover;
