import { Link } from "react-router-dom";
import { useStocksWithPerformance } from "../api/queries";
import { useUploadStockPrices } from "../api/queries/useStockPrices";
import TableView from "../components/common/TableView";
import CSVImport from "../components/CSVImport";
import { formatPerformance } from "../pages/Leaderboard";
import { formatAmount } from "../utils/helper";
import { Box, Tooltip, TextField } from "@mui/material";
// import { toast } from "react-hot-toast";
import React from "react";
import StockSymbolLink from "../components/common/StockSymbolLink";

const Stocks = () => {
  const { data: stocks, isLoading, error } = useStocksWithPerformance();
  const uploadMutation = useUploadStockPrices();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleFileImport = async (file: File) => {
    try {
      await uploadMutation.mutateAsync(file);
      // toast.success("Stock prices uploaded successfully!");
    } catch (error) {
      console.error("Error uploading CSV:", error);
      // toast.error("Failed to upload stock prices");
    }
  };

  const filteredStocks = React.useMemo(() => {
    if (!stocks) return [];
    if (!searchQuery) return stocks;

    const query = searchQuery.toLowerCase();
    return stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query)
    );
  }, [stocks, searchQuery]);

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Nepal Stock Exchange Listed Companies
        </h1>
        <CSVImport
          handleFileImport={handleFileImport}
          label="Upload Today's Prices"
        />
      </div>
      <div className="mb-4">
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search by symbol or company name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            backgroundColor: "white",
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />
      </div>
      <div className="grid gap-4">
        <TableView
          columns={[
            {
              label: "Symbol",
              key: "symbol",
              render: (symbol: string) => <StockSymbolLink symbol={symbol} />,
            },
            {
              label: "Name",
              key: "name",
              minWidth: 200,
              render: (value) => (
                <Tooltip title={value}>
                  <Box
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {value}
                  </Box>
                </Tooltip>
              ),
            },
            {
              label: "Latest Price",
              key: "latestPrice",
              render: (value) => (value ? formatAmount(value, true) : "-"),
            },
            {
              label: "1 Day",
              key: "performance1D",
              render: (value) =>
                value !== null ? formatPerformance(value) : "-",
            },
            {
              label: "1 Week",
              key: "performance1W",
              render: (value) =>
                value !== null ? formatPerformance(value) : "-",
            },
            {
              label: "1 Month",
              key: "performance1M",
              render: (value) =>
                value !== null ? formatPerformance(value) : "-",
            },
          ]}
          tableData={filteredStocks}
        />
      </div>
    </div>
  );
};

export default Stocks;
