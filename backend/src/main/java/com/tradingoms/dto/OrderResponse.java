package com.tradingoms.dto;

import com.tradingoms.model.*;

import java.time.LocalDateTime;

public class OrderResponse {

    private Long id;
    private String symbol;
    private OrderSide side;
    private OrderType type;
    private Integer quantity;
    private Double price;
    private Double stopPrice;
    private OrderStatus status;
    private Integer filledQuantity;
    private Double avgFillPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime filledAt;
    private String account;
    private TimeInForce timeInForce;
    private String notes;

    public static OrderResponse fromEntity(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setSymbol(order.getSymbol());
        response.setSide(order.getSide());
        response.setType(order.getType());
        response.setQuantity(order.getQuantity());
        response.setPrice(order.getPrice());
        response.setStopPrice(order.getStopPrice());
        response.setStatus(order.getStatus());
        response.setFilledQuantity(order.getFilledQuantity());
        response.setAvgFillPrice(order.getAvgFillPrice());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        response.setFilledAt(order.getFilledAt());
        response.setAccount(order.getAccount());
        response.setTimeInForce(order.getTimeInForce());
        response.setNotes(order.getNotes());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public OrderSide getSide() { return side; }
    public void setSide(OrderSide side) { this.side = side; }

    public OrderType getType() { return type; }
    public void setType(OrderType type) { this.type = type; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getStopPrice() { return stopPrice; }
    public void setStopPrice(Double stopPrice) { this.stopPrice = stopPrice; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public Integer getFilledQuantity() { return filledQuantity; }
    public void setFilledQuantity(Integer filledQuantity) { this.filledQuantity = filledQuantity; }

    public Double getAvgFillPrice() { return avgFillPrice; }
    public void setAvgFillPrice(Double avgFillPrice) { this.avgFillPrice = avgFillPrice; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getFilledAt() { return filledAt; }
    public void setFilledAt(LocalDateTime filledAt) { this.filledAt = filledAt; }

    public String getAccount() { return account; }
    public void setAccount(String account) { this.account = account; }

    public TimeInForce getTimeInForce() { return timeInForce; }
    public void setTimeInForce(TimeInForce timeInForce) { this.timeInForce = timeInForce; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
