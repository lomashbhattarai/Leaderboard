import React from "react";
import { useShowAmounts } from "../../contexts/ShowAmountsContext";

interface MaskedQuantityProps {
  value: number;
}

const MaskedQuantity: React.FC<MaskedQuantityProps> = ({ value }) => {
  const { showAmounts } = useShowAmounts();

  if (showAmounts) {
    return <>{value}</>;
  }

  // When masked, show bullets
  return <>••••</>;
};

export default MaskedQuantity;
