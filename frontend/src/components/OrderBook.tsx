import { useEffect, useState } from 'react';
import { Order, OrderRequest, OrderSide, OrderType, TimeInForce } from '../types';
import { api } from '../services/api';
import { Plus, X, Play, RefreshCw, Filter } from 'lucide-react';

export default function OrderBook() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await api.getOrders(statusFilter ? { status: statusFilter } : undefined);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id: number) {
    try {
      await api.cancelOrder(id);
      setSuccessMsg('Order cancelled successfully');
      loadOrders();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel order');
      setTimeout(() => setError(null), 3000);
    }
  }

  async function handleExecute(id: number) {
    try {
      await api.executeOrder(id);
      setSuccessMsg('Order executed successfully');
      loadOrders();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute order');
      setTimeout(() => setError(null), 3000);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
          {successMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="FILLED">Filled</option>
              <option value="PARTIALLY_FILLED">Partially Filled</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
          <button
            onClick={loadOrders}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          New Order
        </button>
      </div>

      {showForm && (
        <OrderForm
          onSubmit={async (order) => {
            await api.createOrder(order);
            setShowForm(false);
            setSuccessMsg('Order created successfully');
            loadOrders();
            setTimeout(() => setSuccessMsg(null), 3000);
          }}
          onCancel={() => setShowForm(false)}
          onError={(msg) => {
            setError(msg);
            setTimeout(() => setError(null), 3000);
          }}
        />
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Symbol</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Side</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Qty</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Filled</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Price</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Avg Fill</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Account</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">TIF</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Created</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={13} className="py-8 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-8 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-gray-600">#{order.id}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{order.symbol}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          order.side === 'BUY'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {order.side}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{order.type}</td>
                    <td className="py-3 px-4 text-right font-mono">{order.quantity}</td>
                    <td className="py-3 px-4 text-right font-mono">{order.filledQuantity}</td>
                    <td className="py-3 px-4 text-right font-mono">
                      {order.price ? `$${order.price.toFixed(2)}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {order.avgFillPrice ? `$${order.avgFillPrice.toFixed(2)}` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3 px-4 text-gray-600">{order.account}</td>
                    <td className="py-3 px-4 text-gray-600">{order.timeInForce}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {(order.status === 'OPEN' || order.status === 'PARTIALLY_FILLED') && (
                          <>
                            <button
                              onClick={() => handleExecute(order.id)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Execute"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCancel(order.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
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

function OrderForm({
  onSubmit,
  onCancel,
  onError,
}: {
  onSubmit: (order: OrderRequest) => Promise<void>;
  onCancel: () => void;
  onError: (msg: string) => void;
}) {
  const [symbol, setSymbol] = useState('');
  const [side, setSide] = useState<OrderSide>('BUY');
  const [type, setType] = useState<OrderType>('MARKET');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [account, setAccount] = useState('ACC-001');
  const [timeInForce, setTimeInForce] = useState<TimeInForce>('DAY');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const order: OrderRequest = {
        symbol: symbol.toUpperCase(),
        side,
        type,
        quantity: parseInt(quantity),
        account,
        timeInForce,
      };
      if (price) order.price = parseFloat(price);
      if (stopPrice) order.stopPrice = parseFloat(stopPrice);
      if (notes) order.notes = notes;
      await onSubmit(order);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  }

  const showPrice = type === 'LIMIT' || type === 'STOP_LIMIT';
  const showStopPrice = type === 'STOP' || type === 'STOP_LIMIT';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Create New Order</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="e.g. AAPL"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Side</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSide('BUY')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                side === 'BUY'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setSide('SELL')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                side === 'SELL'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              SELL
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as OrderType)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MARKET">Market</option>
            <option value="LIMIT">Limit</option>
            <option value="STOP">Stop</option>
            <option value="STOP_LIMIT">Stop Limit</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="100"
            min="1"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {showPrice && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Limit Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}
        {showStopPrice && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stop Price</label>
            <input
              type="number"
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
          <select
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ACC-001">ACC-001</option>
            <option value="ACC-002">ACC-002</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time in Force</label>
          <select
            value={timeInForce}
            onChange={(e) => setTimeInForce(e.target.value as TimeInForce)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="DAY">Day</option>
            <option value="GTC">GTC</option>
            <option value="IOC">IOC</option>
            <option value="FOK">FOK</option>
          </select>
        </div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="lg:col-span-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Order'}
          </button>
        </div>
      </form>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: 'bg-gray-100 text-gray-700',
    OPEN: 'bg-blue-100 text-blue-700',
    PARTIALLY_FILLED: 'bg-amber-100 text-amber-700',
    FILLED: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-red-100 text-red-700',
    REJECTED: 'bg-red-100 text-red-700',
    EXPIRED: 'bg-gray-100 text-gray-700',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        styles[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}
