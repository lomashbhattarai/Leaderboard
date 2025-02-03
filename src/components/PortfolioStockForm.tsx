import React from "react";
import { TextField, Button, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { PortfolioStock, PortfolioStockDTO } from "../types/api";
import { useStockContext } from "../contexts/StockContext";

interface PortfolioStockFormProps {
  initialData?: Partial<PortfolioStock>;
  onSubmit: (data: PortfolioStockDTO) => void;
  portfolioId: number;
}

type FormData = Omit<PortfolioStockDTO, "stockId"> & {
  stockSymbol: string;
};

const PortfolioStockForm: React.FC<PortfolioStockFormProps> = ({
  initialData,
  onSubmit,
  portfolioId,
}) => {
  const { stockMap } = useStockContext();
  const [formData, setFormData] = React.useState<Partial<FormData>>({
    portfolioId,
    stockSymbol: initialData?.stock?.symbol || "",
    quantity: initialData?.quantity,
    buyPrice: initialData?.buyPrice,
    buyDate: initialData?.buyDate,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | null,
    name?: string,
    value?: any
  ) => {
    if (e) {
      // Handle standard input changes
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "quantity" || name === "buyPrice" ? Number(value) : value,
      }));
    } else if (name === "buyDate" && value !== undefined) {
      // Handle DatePicker changes
      setFormData((prev) => ({
        ...prev,
        buyDate: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.stockSymbol && formData.quantity) {
      const stockId = stockMap[formData.stockSymbol];
      if (!stockId) {
        alert("Invalid stock symbol");
        return;
      }

      const portfolioStockData: PortfolioStockDTO = {
        portfolioId,
        stockId,
        quantity: formData.quantity,
        buyPrice: formData.buyPrice,
        buyDate: formData.buyDate,
      };

      onSubmit(portfolioStockData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          label="Stock Symbol"
          name="stockSymbol"
          required
          value={formData.stockSymbol || ""}
          onChange={handleChange}
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          required
          value={formData.quantity || ""}
          onChange={handleChange}
        />
        <TextField
          label="Buy Price (Optional)"
          name="buyPrice"
          type="number"
          value={formData.buyPrice || ""}
          onChange={handleChange}
        />
        <DatePicker
          label="Buy Date (Optional)"
          value={formData.buyDate ? new Date(formData.buyDate) : null}
          onChange={(date) =>
            handleChange(null, "buyDate", date?.toISOString())
          }
        />
        <Button type="submit" variant="contained" color="primary">
          {initialData ? "Update Stock" : "Add Stock"}
        </Button>
      </Stack>
    </form>
  );
};

export default PortfolioStockForm;
