import { Link } from "react-router-dom";
import { useStocks } from "../api/queries";
import { useUploadStockPrices } from "../api/queries/useStockPrices";
import TableView from "../components/common/TableView";
import CSVImport from "../components/CSVImport";
// import { toast } from "react-hot-toast";

const Stocks = () => {
  const { data: stocks, isLoading, error } = useStocks();
  const uploadMutation = useUploadStockPrices();

  const handleFileImport = async (file: File) => {
    try {
      await uploadMutation.mutateAsync(file);
      // toast.success("Stock prices uploaded successfully!");
    } catch (error) {
      console.error("Error uploading CSV:", error);
      // toast.error("Failed to upload stock prices");
    }
  };

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
        />
      </div>
    </div>
  );
};

export default Stocks;
