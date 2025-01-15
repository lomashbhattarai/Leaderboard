import { formatAmount } from "../../utils/helper";

import { Paper } from "@mui/material";

import { Typography } from "@mui/material";

const AmountSummary = ({ label, value }: { label: string; value: number }) => {
  return (
    <Paper sx={{ p: 2 }} className="h-[130px]">
      <Typography variant="h6">{label}</Typography>
      <Typography variant="h4">{formatAmount(value)}</Typography>
    </Paper>
  );
};

export default AmountSummary;
