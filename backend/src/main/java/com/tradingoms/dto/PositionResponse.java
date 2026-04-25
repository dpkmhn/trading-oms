package com.tradingoms.dto;

import com.tradingoms.model.Position;

import java.time.LocalDateTime;

public class PositionResponse {

    private Long id;
    private String symbol;
    private Integer quantity;
    private Double avgCost;
    private Double currentPrice;
    private Double marketValue;
    private Double unrealizedPnl;
    private Double realizedPnl;
    private String account;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PositionResponse fromEntity(Position position) {
        PositionResponse response = new PositionResponse();
        response.setId(position.getId());
        response.setSymbol(position.getSymbol());
        response.setQuantity(position.getQuantity());
        response.setAvgCost(position.getAvgCost());
        response.setCurrentPrice(position.getCurrentPrice());
        response.setMarketValue(position.getMarketValue());
        response.setUnrealizedPnl(position.getUnrealizedPnl());
        response.setRealizedPnl(position.getRealizedPnl());
        response.setAccount(position.getAccount());
        response.setCreatedAt(position.getCreatedAt());
        response.setUpdatedAt(position.getUpdatedAt());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getAvgCost() { return avgCost; }
    public void setAvgCost(Double avgCost) { this.avgCost = avgCost; }

    public Double getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(Double currentPrice) { this.currentPrice = currentPrice; }

    public Double getMarketValue() { return marketValue; }
    public void setMarketValue(Double marketValue) { this.marketValue = marketValue; }

    public Double getUnrealizedPnl() { return unrealizedPnl; }
    public void setUnrealizedPnl(Double unrealizedPnl) { this.unrealizedPnl = unrealizedPnl; }

    public Double getRealizedPnl() { return realizedPnl; }
    public void setRealizedPnl(Double realizedPnl) { this.realizedPnl = realizedPnl; }

    public String getAccount() { return account; }
    public void setAccount(String account) { this.account = account; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
