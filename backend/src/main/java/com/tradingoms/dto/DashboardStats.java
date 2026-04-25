package com.tradingoms.dto;

public class DashboardStats {

    private long totalOrders;
    private long openOrders;
    private long filledOrders;
    private long cancelledOrders;
    private long totalTrades;
    private int totalPositions;
    private double totalMarketValue;
    private double totalUnrealizedPnl;
    private double totalRealizedPnl;

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getOpenOrders() { return openOrders; }
    public void setOpenOrders(long openOrders) { this.openOrders = openOrders; }

    public long getFilledOrders() { return filledOrders; }
    public void setFilledOrders(long filledOrders) { this.filledOrders = filledOrders; }

    public long getCancelledOrders() { return cancelledOrders; }
    public void setCancelledOrders(long cancelledOrders) { this.cancelledOrders = cancelledOrders; }

    public long getTotalTrades() { return totalTrades; }
    public void setTotalTrades(long totalTrades) { this.totalTrades = totalTrades; }

    public int getTotalPositions() { return totalPositions; }
    public void setTotalPositions(int totalPositions) { this.totalPositions = totalPositions; }

    public double getTotalMarketValue() { return totalMarketValue; }
    public void setTotalMarketValue(double totalMarketValue) { this.totalMarketValue = totalMarketValue; }

    public double getTotalUnrealizedPnl() { return totalUnrealizedPnl; }
    public void setTotalUnrealizedPnl(double totalUnrealizedPnl) { this.totalUnrealizedPnl = totalUnrealizedPnl; }

    public double getTotalRealizedPnl() { return totalRealizedPnl; }
    public void setTotalRealizedPnl(double totalRealizedPnl) { this.totalRealizedPnl = totalRealizedPnl; }
}
