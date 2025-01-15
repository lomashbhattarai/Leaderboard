import React from "react";
import { useParams } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { usePublicPortfolio } from "../api/queries/usePortfolios";

const SharedPortfolio: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: publicPortfolio,
    isLoading,
    error,
  } = usePublicPortfolio(Number(id));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading portfolio</div>;
  if (!publicPortfolio) return <div>No portfolio found</div>;

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {/* {data.userName}'s */}
        {publicPortfolio.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Allocation Table</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Symbol</th>
                <th className="text-right">Allocation (%)</th>
              </tr>
            </thead>
            <tbody>
              {publicPortfolio.portfolioStocks?.map((stockInPortfolio) => (
                <tr key={stockInPortfolio.symbol}>
                  <td>{stockInPortfolio.symbol}</td>
                  <td className="text-right">
                    {stockInPortfolio.percentage.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Allocation Chart</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={publicPortfolio.portfolioStocks}
                dataKey="percentage"
                nameKey="symbol"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label={({ symbol, percent }) =>
                  `${symbol} ${(percent * 100).toFixed(0)}%`
                }
              >
                {publicPortfolio.portfolioStocks?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              {/* <Legend /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
];

export default SharedPortfolio;
