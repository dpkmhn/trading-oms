import { Order, Trade, Position, DashboardStats, OrderRequest } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

export const api = {
  getDashboardStats: () => request<DashboardStats>('/api/dashboard/stats'),

  getOrders: (params?: { status?: string; symbol?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.symbol) searchParams.set('symbol', params.symbol);
    const query = searchParams.toString();
    return request<Order[]>(`/api/orders${query ? `?${query}` : ''}`);
  },

  getOrder: (id: number) => request<Order>(`/api/orders/${id}`),

  createOrder: (order: OrderRequest) =>
    request<Order>('/api/orders', { method: 'POST', body: JSON.stringify(order) }),

  cancelOrder: (id: number) =>
    request<Order>(`/api/orders/${id}/cancel`, { method: 'POST' }),

  executeOrder: (id: number) =>
    request<Order>(`/api/orders/${id}/execute`, { method: 'POST' }),

  getTrades: (params?: { symbol?: string; orderId?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.symbol) searchParams.set('symbol', params.symbol);
    if (params?.orderId) searchParams.set('orderId', params.orderId.toString());
    const query = searchParams.toString();
    return request<Trade[]>(`/api/trades${query ? `?${query}` : ''}`);
  },

  getPositions: (activeOnly = true) =>
    request<Position[]>(`/api/positions?activeOnly=${activeOnly}`),
};
