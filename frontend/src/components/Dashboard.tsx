import { useEffect, useState } from 'react';
import { DashboardStats, Order, Position } from '../types';
import { api } from '../services/api';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  ShoppingCart,
  CheckCircle2,
  Briefcase,
  DollarSign,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [s, p, o] = await Promise.all([
        api.getDashboardStats(),
        api.getPositions(true),
        api.getOrders(),
      ]);
      setStats(s);
      setPositions(p);
      setRecentOrders(o.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!stats) return null;

  const orderStatusData = [
    { name: 'Open', value: stats.openOrders, color: '#3B82F6' },
    { name: 'Filled', value: stats.filledOrders, color: '#10B981' },
    { name: 'Cancelled', value: stats.cancelledOrders, color: '#EF4444' },
  ].filter((d) => d.value > 0);

  const positionData = positions.map((p) => ({
    name: p.symbol,
    value: Math.abs(p.marketValue),
    pnl: p.unrealizedPnl,
  }));

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
    },
    {
      title: 'Open Orders',
      value: stats.openOrders,
      icon: BarChart3,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgLight: 'bg-amber-50',
    },
    {
      title: 'Filled Orders',
      value: stats.filledOrders,
      icon: CheckCircle2,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgLight: 'bg-emerald-50',
    },
    {
      title: 'Active Positions',
      value: stats.totalPositions,
      icon: Briefcase,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`${card.bgLight} p-3 rounded-lg`}>
                <card.icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-500">Portfolio Value</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${stats.totalMarketValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-1">
            {stats.totalUnrealizedPnl >= 0 ? (
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm font-medium text-gray-500">Unrealized P&L</span>
          </div>
          <p
            className={`text-2xl font-bold ${
              stats.totalUnrealizedPnl >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {stats.totalUnrealizedPnl >= 0 ? '+' : ''}$
            {stats.totalUnrealizedPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-1">
            {stats.totalRealizedPnl >= 0 ? (
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm font-medium text-gray-500">Realized P&L</span>
          </div>
          <p
            className={`text-2xl font-bold ${
              stats.totalRealizedPnl >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {stats.totalRealizedPnl >= 0 ? '+' : ''}$
            {stats.totalRealizedPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
          {orderStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">No orders yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Position Values</h3>
          {positionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={positionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) =>
                    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                  }
                />
                <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} name="Market Value" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">No positions yet</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Symbol</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Side</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Qty</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
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
                  <td className="py-3 px-4 text-right font-mono">
                    {order.avgFillPrice
                      ? `$${order.avgFillPrice.toFixed(2)}`
                      : order.price
                      ? `$${order.price.toFixed(2)}`
                      : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
