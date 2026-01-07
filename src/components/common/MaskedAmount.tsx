import React from "react";
import { formatAmount } from "../../utils/helper";
import { useShowAmounts } from "../../contexts/ShowAmountsContext";

interface MaskedAmountProps {
  value: number;
  hideCurrency?: boolean;
}

const MaskedAmount: React.FC<MaskedAmountProps> = ({
  value,
  hideCurrency = false,
}) => {
  const { showAmounts } = useShowAmounts();

  if (showAmounts) {
    return <>{formatAmount(value, hideCurrency)}</>;
  }

  // When masked, show bullets
  const maskedValue = hideCurrency ? "••••••" : "Rs. ••••••";
  return <>{maskedValue}</>;
};

export default MaskedAmount;
