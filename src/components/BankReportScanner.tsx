import React from "react";

const BankReportScanner: React.FC = () => {
  return (
    <div className="bank-report-scanner">
      <h2>Bank Report Scanner</h2>
      <div className="upload-section">
        <input type="file" accept=".pdf,.jpg,.png" />
        <button>Scan Report</button>
      </div>
      <div className="results-section">
        {/* OCR results will be displayed here */}
      </div>
    </div>
  );
};

export default BankReportScanner;
