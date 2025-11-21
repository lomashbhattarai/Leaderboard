import React from "react";
import { useParams } from "react-router-dom";
import TableView, { ColumnConfig } from "../components/common/TableView";
import { useStockPrices } from "../api/queries/useStockPrices";
import { useStockContext } from "../contexts/StockContext";

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { stockMap } = useStockContext();
  const stockId = stockMap[symbol!];
  const { data: stockPrices, isLoading, error } = useStockPrices(stockId || 0);

  const columns: ColumnConfig[] = [
    { label: "Date", key: "date", align: "left" },
    { label: "Open", key: "open", align: "right" },
    { label: "High", key: "high", align: "right" },
    { label: "Low", key: "low", align: "right" },
    { label: "Close", key: "closingPrice", align: "right" },
    { label: "Volume", key: "volume", align: "right" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Stock Details: {symbol}</h1>
      <div className="grid gap-4">
        <div className="p-4 border rounded">
          <h2 className="font-bold">Company Information</h2>
          <p>Details for {symbol} will be displayed here</p>
        </div>
        <div className="p-4 border rounded">
          <h2 className="font-bold">Stock Prices</h2>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error loading stock prices</p>}
          {stockPrices && stockPrices.length > 0 && (
            <TableView
              columns={columns}
              tableData={stockPrices}
              title="Stock Prices"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
