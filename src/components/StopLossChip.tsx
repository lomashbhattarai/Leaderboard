import React from "react";
import { Chip, Tooltip } from "@mui/material";
import { formatAmount } from "../utils/helper";

interface StopLossChipProps {
  type: "ABSOLUTE" | "PERCENTAGE";
  value: number;
  status: string;
}

const StopLossChip: React.FC<StopLossChipProps> = ({ type, value, status }) => {
  const label = type === "ABSOLUTE" ? `${formatAmount(value)}` : `${value}%`;

  const getColor = () => {
    switch (status) {
      case "TRIGGERED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Tooltip title={`${status}: ${label}`}>
      <Chip
        label={label}
        size="small"
        color={getColor()}
        sx={{
          mr: 0.5,
          maxWidth: "120px",
          "& .MuiChip-label": {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        }}
      />
    </Tooltip>
  );
};

export default StopLossChip;
