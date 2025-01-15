import React from "react";
import MeroshareImport from "../components/MeroshareImport";
import StopLoss from "../components/StopLoss";
import PortfolioChart from "../components/PortfolioChart";
import PortfolioTable from "../components/PortfolioTable";
import PortfolioValue from "../components/PortfolioValue";
import ReportsAnalysis from "../components/ReportsAnalysis";
import BankReportScanner from "../components/BankReportScanner";
import { usePortfolio } from "../hooks/usePortfolio";
import { Stack } from "@mui/material";
import TableView from "../components/common/TableView";

const Portfolio: React.FC = () => {
  const { portfolio, portfolioStocksFromDb, addPortfolio } = usePortfolio();

  return (
    <div className="portfolio-container">
      <div className="portfolio-grid">
        <MeroshareImport addPortfolio={addPortfolio} />
        <div>Print Portfolio summary</div>

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
          <PortfolioValue portfolio={portfolio} />
          <PortfolioChart portfolio={portfolio} />
        </Stack>

        <PortfolioTable
          portfolio={portfolio}
          portfolioStocksFromDb={portfolioStocksFromDb}
        />

        {/* <StopLoss />
        <ReportsAnalysis />
        <BankReportScanner /> */}
      </div>
    </div>
  );
};

export default Portfolio;
