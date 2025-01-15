export type ScriptInPortfolio = {
  serialNumber: string;
  script: string;
  currentBalance: number;
  previousClosingPrice: number;
  valueAtPreviousClosing: number;
  lastTransactionPrice: number;
  valueAtLTP: number;
};
