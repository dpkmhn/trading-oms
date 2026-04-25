import { useEffect, useState } from "react";
import { Position } from "../types";
import { api } from "../services/api";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function Positions() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPositions();
  }, []);

  async function loadPositions() {
    setLoading(true);
    try {
      const data = await api.getPositions(true);
      setPositions(data);
    } catch (err) {
      console.error("Failed to load positions", err);
    } finally {
      setLoading(false);
    }
  }

  const totalValue = positions.reduce(
    (sum, p) => sum + Math.abs(p.marketValue),
    0,
  );
  const totalUnrealizedPnl = positions.reduce(
    (sum, p) => sum + p.unrealizedPnl,
    0,
  );
  const totalRealizedPnl = positions.reduce((sum, p) => sum + p.realizedPnl, 0);

  const pnlData = positions.map((p) => ({
    symbol: p.symbol,
    pnl: p.unrealizedPnl,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {positions.length} active position(s)
        </p>
        <button
          onClick={loadPositions}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Total Market Value
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-slate-100 mt-1">
            $
            {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Unrealized P&L
          </p>
          <div className="flex items-center gap-2 mt-1">
            {totalUnrealizedPnl >= 0 ? (
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            <p
              className={`text-xl font-bold ${
                totalUnrealizedPnl >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {totalUnrealizedPnl >= 0 ? "+" : ""}$
              {totalUnrealizedPnl.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Realized P&L
          </p>
          <div className="flex items-center gap-2 mt-1">
            {totalRealizedPnl >= 0 ? (
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            <p
              className={`text-xl font-bold ${
                totalRealizedPnl >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {totalRealizedPnl >= 0 ? "+" : ""}$
              {totalRealizedPnl.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      {pnlData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
            Unrealized P&L by Position
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pnlData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis
                dataKey="symbol"
                tick={{ fontSize: 12, fill: "#94A3B8" }}
              />
              <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} />
              <Tooltip
                formatter={(value: number) =>
                  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                }
              />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]} name="Unrealized P&L">
                {pnlData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.pnl >= 0 ? "#10B981" : "#EF4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Symbol
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Quantity
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Avg Cost
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Current Price
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Market Value
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Unrealized P&L
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Realized P&L
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Account
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-gray-400 dark:text-slate-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : positions.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-gray-400 dark:text-slate-500"
                  >
                    No active positions
                  </td>
                </tr>
              ) : (
                positions.map((pos) => (
                  <tr
                    key={pos.id}
                    className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">
                      {pos.symbol}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span
                        className={
                          pos.quantity > 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {pos.quantity > 0 ? "+" : ""}
                        {pos.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-900 dark:text-slate-100">
                      ${pos.avgCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-900 dark:text-slate-100">
                      ${pos.currentPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-gray-900 dark:text-slate-100">
                      $
                      {Math.abs(pos.marketValue).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span
                        className={`font-semibold ${
                          pos.unrealizedPnl >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {pos.unrealizedPnl >= 0 ? "+" : ""}$
                        {pos.unrealizedPnl.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span
                        className={`${
                          pos.realizedPnl >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {pos.realizedPnl >= 0 ? "+" : ""}$
                        {pos.realizedPnl.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-slate-400">
                      {pos.account}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
