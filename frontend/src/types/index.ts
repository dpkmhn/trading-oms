export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
export type OrderStatus = 'PENDING' | 'OPEN' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED' | 'REJECTED' | 'EXPIRED';
export type TimeInForce = 'DAY' | 'GTC' | 'IOC' | 'FOK';

export interface Order {
  id: number;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price: number | null;
  stopPrice: number | null;
  status: OrderStatus;
  filledQuantity: number;
  avgFillPrice: number | null;
  createdAt: string;
  updatedAt: string;
  filledAt: string | null;
  account: string;
  timeInForce: TimeInForce;
  notes: string | null;
}

export interface Trade {
  id: number;
  orderId: number;
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
  executedAt: string;
  account: string;
  commission: number;
}

export interface Position {
  id: number;
  symbol: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnl: number;
  realizedPnl: number;
  account: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalOrders: number;
  openOrders: number;
  filledOrders: number;
  cancelledOrders: number;
  totalTrades: number;
  totalPositions: number;
  totalMarketValue: number;
  totalUnrealizedPnl: number;
  totalRealizedPnl: number;
}

export interface OrderRequest {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  stopPrice?: number;
  account: string;
  timeInForce: TimeInForce;
  notes?: string;
}
