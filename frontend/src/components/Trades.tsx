import { useEffect, useState } from "react";
import { Trade } from "../types";
import { api } from "../services/api";
import { RefreshCw } from "lucide-react";

export default function Trades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrades();
  }, []);

  async function loadTrades() {
    setLoading(true);
    try {
      const data = await api.getTrades();
      setTrades(data);
    } catch (err) {
      console.error("Failed to load trades", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {trades.length} trade(s)
        </p>
        <button
          onClick={loadTrades}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Trade ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Symbol
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Side
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Quantity
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Price
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Value
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Commission
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Account
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-slate-400">
                  Executed At
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-8 text-center text-gray-400 dark:text-slate-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : trades.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-8 text-center text-gray-400 dark:text-slate-500"
                  >
                    No trades found
                  </td>
                </tr>
              ) : (
                trades.map((trade) => (
                  <tr
                    key={trade.id}
                    className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-gray-600 dark:text-slate-400">
                      #{trade.id}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600 dark:text-slate-400">
                      #{trade.orderId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">
                      {trade.symbol}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          trade.side === "BUY"
                            ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                            : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {trade.side}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-900 dark:text-slate-100">
                      {trade.quantity}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-900 dark:text-slate-100">
                      ${trade.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-gray-900 dark:text-slate-100">
                      $
                      {(trade.quantity * trade.price).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2 },
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-500 dark:text-slate-500">
                      ${trade.commission.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-slate-400">
                      {trade.account}
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-slate-500 text-xs whitespace-nowrap">
                      {new Date(trade.executedAt).toLocaleString()}
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
