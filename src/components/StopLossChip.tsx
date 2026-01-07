import React from "react";
import { Chip, Tooltip } from "@mui/material";
import { formatAmount } from "../utils/helper";
import { useShowAmounts } from "../contexts/ShowAmountsContext";

interface StopLossChipProps {
  type: "ABSOLUTE" | "PERCENTAGE";
  value: number;
  status: string;
  color?: "default" | "warning" | "error";
}

const StopLossChip: React.FC<StopLossChipProps> = ({
  type,
  value,
  status,
  color = "default",
}) => {
  const { showAmounts } = useShowAmounts();
  const label =
    type === "ABSOLUTE"
      ? showAmounts
        ? `${formatAmount(value)}`
        : "Rs. ••••••"
      : `${value}%`;

  return (
    <Tooltip title={`${status}: ${label}`}>
      <Chip
        label={label}
        size="small"
        color={color}
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
