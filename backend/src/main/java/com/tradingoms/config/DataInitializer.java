package com.tradingoms.config;

import com.tradingoms.dto.OrderRequest;
import com.tradingoms.model.OrderSide;
import com.tradingoms.model.OrderType;
import com.tradingoms.model.TimeInForce;
import com.tradingoms.service.OrderService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final OrderService orderService;

    public DataInitializer(OrderService orderService) {
        this.orderService = orderService;
    }

    @Override
    public void run(String... args) {
        createOrder("AAPL", OrderSide.BUY, OrderType.MARKET, 100, null, "ACC-001", "Initial AAPL position");
        createOrder("GOOGL", OrderSide.BUY, OrderType.MARKET, 50, null, "ACC-001", "Initial GOOGL position");
        createOrder("MSFT", OrderSide.BUY, OrderType.MARKET, 75, null, "ACC-001", "Initial MSFT position");
        createOrder("TSLA", OrderSide.BUY, OrderType.MARKET, 30, null, "ACC-002", "Initial TSLA position");
        createOrder("NVDA", OrderSide.BUY, OrderType.MARKET, 40, null, "ACC-002", "Initial NVDA position");
        createOrder("AMZN", OrderSide.BUY, OrderType.LIMIT, 60, 182.50, "ACC-001", "Limit buy AMZN");
        createOrder("META", OrderSide.BUY, OrderType.LIMIT, 25, 495.00, "ACC-002", "Limit buy META");
        createOrder("JPM", OrderSide.SELL, OrderType.LIMIT, 50, 200.00, "ACC-001", "Limit sell JPM");
    }

    private void createOrder(String symbol, OrderSide side, OrderType type, int quantity,
                             Double price, String account, String notes) {
        OrderRequest request = new OrderRequest();
        request.setSymbol(symbol);
        request.setSide(side);
        request.setType(type);
        request.setQuantity(quantity);
        request.setPrice(price);
        request.setAccount(account);
        request.setTimeInForce(TimeInForce.DAY);
        request.setNotes(notes);
        orderService.createOrder(request);
    }
}
