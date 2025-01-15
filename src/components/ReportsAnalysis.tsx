import React from "react";

const ReportsAnalysis: React.FC = () => {
  return (
    <div className="reports-analysis">
      <h2>Reports Analysis</h2>
      <div className="analysis-container">
        <div className="filters">
          <select>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
          </select>
        </div>
        <div className="analysis-content">
          {/* Analysis charts and data will go here */}
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalysis;
