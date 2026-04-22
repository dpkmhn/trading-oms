package com.tradingoms.dto;

import com.tradingoms.model.OrderSide;
import com.tradingoms.model.Trade;

import java.time.LocalDateTime;

public class TradeResponse {

    private Long id;
    private Long orderId;
    private String symbol;
    private OrderSide side;
    private Integer quantity;
    private Double price;
    private LocalDateTime executedAt;
    private String account;
    private Double commission;

    public static TradeResponse fromEntity(Trade trade) {
        TradeResponse response = new TradeResponse();
        response.setId(trade.getId());
        response.setOrderId(trade.getOrder().getId());
        response.setSymbol(trade.getSymbol());
        response.setSide(trade.getSide());
        response.setQuantity(trade.getQuantity());
        response.setPrice(trade.getPrice());
        response.setExecutedAt(trade.getExecutedAt());
        response.setAccount(trade.getAccount());
        response.setCommission(trade.getCommission());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public OrderSide getSide() { return side; }
    public void setSide(OrderSide side) { this.side = side; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public LocalDateTime getExecutedAt() { return executedAt; }
    public void setExecutedAt(LocalDateTime executedAt) { this.executedAt = executedAt; }

    public String getAccount() { return account; }
    public void setAccount(String account) { this.account = account; }

    public Double getCommission() { return commission; }
    public void setCommission(Double commission) { this.commission = commission; }
}
