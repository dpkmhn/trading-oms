import { useEffect, useState } from 'react';
import { Trade } from '../types';
import { api } from '../services/api';
import { RefreshCw } from 'lucide-react';

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
      console.error('Failed to load trades', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{trades.length} trade(s)</p>
        <button
          onClick={loadTrades}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Trade ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Symbol</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Side</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Quantity</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Price</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Value</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Commission</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Account</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Executed At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : trades.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-gray-400">
                    No trades found
                  </td>
                </tr>
              ) : (
                trades.map((trade) => (
                  <tr
                    key={trade.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-gray-600">#{trade.id}</td>
                    <td className="py-3 px-4 font-mono text-gray-600">#{trade.orderId}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{trade.symbol}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          trade.side === 'BUY'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {trade.side}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">{trade.quantity}</td>
                    <td className="py-3 px-4 text-right font-mono">${trade.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold">
                      ${(trade.quantity * trade.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-500">
                      ${trade.commission.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{trade.account}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">
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
