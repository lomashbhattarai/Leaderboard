import { formatAmount } from "../../utils/helper";
import { useTheme } from "../../contexts/ThemeContext";
import { getCommonStyles } from "../../themes/commonComponents";
import { alpha } from "@mui/material/styles";

import { Paper } from "@mui/material";
import { Typography } from "@mui/material";

const AmountSummary = ({ label, value }: { label: string; value: number }) => {
  const { currentTheme } = useTheme();
  const styles = getCommonStyles(currentTheme);

  return (
    <Paper
      sx={{
        p: 3,
        ...styles.paper,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
      className="h-[130px]"
    >
      <Typography
        variant="subtitle1"
        sx={{
          color: alpha(currentTheme.accent.primary, 0.7),
          fontSize: "0.9rem",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: currentTheme.accent.primary,
          fontWeight: 600,
          letterSpacing: "-0.5px",
        }}
      >
        {formatAmount(value)}
      </Typography>
    </Paper>
  );
};

export default AmountSummary;
