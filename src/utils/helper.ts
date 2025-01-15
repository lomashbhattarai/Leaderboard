export const formatAmount = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "NPR",
  }).format(value);
};
