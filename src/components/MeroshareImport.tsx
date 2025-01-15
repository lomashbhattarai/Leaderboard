import React from "react";
import CSVImport from "./CSVImport";
import { ScriptInPortfolio } from "../types/portfolio";

const MeroshareImport: React.FC<{
  addPortfolio: (portfolio: ScriptInPortfolio[]) => void;
}> = ({ addPortfolio }) => {
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
    <CSVImport label="Import from Meroshare" handleImport={handleImport} />
  );
};

export default MeroshareImport;
