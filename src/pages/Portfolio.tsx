import React from "react";
import MeroshareImport from "../components/MeroshareImport";
import StopLoss from "../components/StopLoss";
import PortfolioChart from "../components/PortfolioChart";
import PortfolioTable from "../components/PortfolioTable";
import PortfolioValue from "../components/PortfolioValue";
import ReportsAnalysis from "../components/ReportsAnalysis";
import BankReportScanner from "../components/BankReportScanner";
import { usePortfolio } from "../hooks/usePortfolio";
import { Alert, Stack } from "@mui/material";

const Portfolio: React.FC = () => {
  const { portfolioStocksFromDb, addPortfolio } = usePortfolio();

  return (
    <div className="portfolio-container">
      <div className="portfolio-grid">
        <Alert severity="info" className="mb-4">
          Login to your Meroshare account and go to "My Portfolio" page. Click
          on the "CSV" button to import the CSV of your portfolio to your
          computer. Upload the CSV file by clicking the button below.
        </Alert>

        <MeroshareImport addPortfolio={addPortfolio} />
        {/* <div>Print Portfolio summary</div> */}

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          width="100%"
          sx={{
            "& > *": {
              flex: 1,
              minWidth: { xs: "100%", md: "auto" },
            },
          }}
          className="mt-16"
        >
          <PortfolioValue portfolioStocksFromDb={portfolioStocksFromDb} />
          <PortfolioChart portfolioStocksFromDb={portfolioStocksFromDb} />
        </Stack>

        <PortfolioTable portfolioStocksFromDb={portfolioStocksFromDb} />

        {/* <StopLoss />
        <ReportsAnalysis />
        <BankReportScanner /> */}
      </div>
    </div>
  );
};

export default Portfolio;
