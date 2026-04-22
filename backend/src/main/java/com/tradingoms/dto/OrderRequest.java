package com.tradingoms.dto;

import com.tradingoms.model.OrderSide;
import com.tradingoms.model.OrderType;
import com.tradingoms.model.TimeInForce;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class OrderRequest {

    @NotBlank(message = "Symbol is required")
    private String symbol;

    @NotNull(message = "Side is required")
    private OrderSide side;

    @NotNull(message = "Order type is required")
    private OrderType type;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    private Double price;

    private Double stopPrice;

    @NotBlank(message = "Account is required")
    private String account;

    private TimeInForce timeInForce = TimeInForce.DAY;

    private String notes;

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

    public String getAccount() { return account; }
    public void setAccount(String account) { this.account = account; }

    public TimeInForce getTimeInForce() { return timeInForce; }
    public void setTimeInForce(TimeInForce timeInForce) { this.timeInForce = timeInForce; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
