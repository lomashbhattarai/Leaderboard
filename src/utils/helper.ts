export const formatAmount = (value: number, hideCurrency = false) => {
  return new Intl.NumberFormat("en-IN", {
    style: hideCurrency ? "decimal" : "currency",
    currency: "NPR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
