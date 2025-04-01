import React from "react";
import CSVImport from "./CSVImport";
import { ScriptInPortfolio } from "../types/portfolio";
import { useTheme } from "../contexts/ThemeContext";

const MeroshareImport: React.FC<{
  addPortfolio: (portfolio: ScriptInPortfolio[]) => void;
  columnsToImport?: string[];
  customColumn?: {
    name: string;
    render: (rowData: string[], tableData: string[][]) => string;
  };
  buttonVariant?: "contained" | "outlined" | "text";
  buttonColor?:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
}> = ({
  addPortfolio,
  columnsToImport,
  customColumn,
  buttonVariant,
  buttonColor,
}) => {
  const { currentTheme } = useTheme();

  const handleImport = (csvData: string[][]) => {
    const cleanValue = (value: string) => {
      return value?.replace(/^"(.*)"$/, "$1") || "";
    };

    const scripts: ScriptInPortfolio[] = csvData.slice(1, -2).map((row) => {
      return {
        serialNumber: cleanValue(row[0]),
        script: cleanValue(row[1]),
        currentBalance: Number(cleanValue(row[2])),
        previousClosingPrice: Number(cleanValue(row[3])),
        valueAtPreviousClosing: Number(cleanValue(row[4])),
        lastTransactionPrice: Number(cleanValue(row[5])),
        valueAtLTP: Number(cleanValue(row[6])),
      };
    });
    addPortfolio(scripts);
  };

  return (
    <CSVImport
      label="Upload Meroshare Portfolio CSV"
      variant={buttonVariant}
      color={buttonColor}
      handleImport={handleImport}
      columnsToImport={columnsToImport}
      customColumn={customColumn}
      sx={{
        color:
          buttonVariant === "outlined"
            ? currentTheme.accent.primary
            : currentTheme.text.primary,
        borderColor: currentTheme.accent.primary,
        "&:hover": {
          borderColor: currentTheme.accent.secondary,
          backgroundColor:
            buttonVariant === "outlined"
              ? "transparent"
              : currentTheme.accent.secondary,
        },
      }}
    />
  );
};

export default MeroshareImport;
