import React from "react";
import { useParams } from "react-router-dom";

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Stock Details: {symbol}</h1>
      {/* TODO: Add actual stock details content */}
      <div className="grid gap-4">
        <div className="p-4 border rounded">
          <h2 className="font-bold">Company Information</h2>
          <p>Details for {symbol} will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
