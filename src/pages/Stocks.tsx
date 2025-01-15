import React from "react";
import { Link } from "react-router-dom";
import { useStocks } from "../api/queries";
import TableView from "../components/common/TableView";
import { Stock } from "../types/api";

const Stocks = () => {
  // TODO: Add actual stocks data fetching logic
  const { data: stocks, isLoading, error } = useStocks();

  console.log({ stocks });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Nepal Stock Exchange Listed Companies
      </h1>
      <div className="grid gap-4">
        <TableView
          columns={[
            {
              label: "Symbol",
              key: "symbol",
              render: (symbol: string) => (
                <Link
                  key={symbol}
                  to={`/stock/${symbol}`}
                  className="hover:bg-gray-50"
                >
                  {symbol}
                </Link>
              ),
            },
            {
              label: "Name",
              key: "name",
            },
          ]}
          tableData={stocks || []}
          // title="Nepal Stock Exchange Listed Companies"
        />
      </div>
    </div>
  );
};

export default Stocks;
