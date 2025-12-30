import { Link } from "react-router-dom";
import { useStocksWithPerformance } from "../api/queries";
import { useUploadStockPrices } from "../api/queries/useStockPrices";
import TableView from "../components/common/TableView";
import CSVImport from "../components/CSVImport";
import { formatPerformance } from "../pages/Leaderboard";
import { formatAmount } from "../utils/helper";
import { Box, Tooltip, TextField } from "@mui/material";
import { showToast } from "../utils/toast";
import React, { useState } from "react";
import StockLink from "../components/common/StockLink";
import { useAuthContext } from "../contexts/AuthContext";
import AddToWatchListHover from "../components/AddToWatchListHover";
import StockCard from "../components/StockCard";

const Stocks = () => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    order: "asc" | "desc";
  }>({
    key: "performance1M",
    order: "desc",
  });

  const {
    data: stocks,
    isLoading,
    error,
  } = useStocksWithPerformance({
    sortBy: sortConfig.key,
    sortOrder: sortConfig.order,
  });
  const uploadMutation = useUploadStockPrices();
  const [searchQuery, setSearchQuery] = React.useState("");
  const { user } = useAuthContext();

  console.log(user);

  const handleFileImport = async (file: File) => {
    try {
      await uploadMutation.mutateAsync(file);
      showToast.success("Stock prices upload in progress!");
    } catch (error) {
      console.error("Error uploading CSV:", error);
      showToast.error("Failed to upload stock prices");
    }
  };

  const handleSort = (key: string, order: "asc" | "desc") => {
    setSortConfig({ key, order });
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
      <Box sx={{ px: { xs: 2, sm: 0 } }}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            Nepal Stock Exchange Listed Companies
          </h1>
          {user?.role === "superadmin" && (
            <CSVImport
              handleFileImport={handleFileImport}
              label="Upload Today's Prices"
            />
          )}
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
      </Box>

      <TableView
        isCompact
        columns={[
          {
            label: "Symbol",
            key: "symbol",
            sortable: true,
            render: (symbol: string, row) => (
              <AddToWatchListHover stockId={row.id} alwaysShow={true}>
                <StockLink symbol={symbol} />
              </AddToWatchListHover>
            ),
          },
          {
            label: "Name",
            key: "name",
            sortable: true,
            minWidth: 200,
            render: (value) => (
              <Tooltip title={value}>
                <Box
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "260px",
                    width: "100%",
                    display: "block",
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
            sortable: true,
            render: (value) => (value ? formatAmount(value, true) : "-"),
          },
          {
            label: "1 Day",
            key: "performance1D",
            sortable: true,
            render: (value) =>
              value !== null ? formatPerformance(value) : "-",
          },
          {
            label: "1 Week",
            key: "performance1W",
            sortable: true,
            render: (value) =>
              value !== null ? formatPerformance(value) : "-",
          },
          {
            label: "1 Month",
            key: "performance1M",
            sortable: true,
            render: (value) =>
              value !== null ? formatPerformance(value) : "-",
          },
        ]}
        tableData={filteredStocks}
        onSort={handleSort}
        currentSort={sortConfig}
        customCardComponent={(row) => <StockCard row={row} />}
      />
    </div>
  );
};

export default Stocks;
