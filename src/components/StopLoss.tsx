import React from "react";

const StopLoss: React.FC = () => {
  const [stopLoss, setStopLoss] = React.useState<number>(0);

  return (
    <div className="stop-loss">
      <h2>Stop Loss Settings</h2>
      <div>
        <input
          type="number"
          value={stopLoss}
          onChange={(e) => setStopLoss(Number(e.target.value))}
          placeholder="Enter stop loss percentage"
        />
      </div>
    </div>
  );
};

export default StopLoss;
