package com.tradingoms.service;

import com.tradingoms.dto.OrderRequest;
import com.tradingoms.model.*;
import com.tradingoms.repository.OrderRepository;
import com.tradingoms.repository.PositionRepository;
import com.tradingoms.repository.TradeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final TradeRepository tradeRepository;
    private final PositionRepository positionRepository;
    private final Random random = new Random();

    public OrderService(OrderRepository orderRepository, TradeRepository tradeRepository,
                        PositionRepository positionRepository) {
        this.orderRepository = orderRepository;
        this.tradeRepository = tradeRepository;
        this.positionRepository = positionRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    public List<Order> getOrdersBySymbol(String symbol) {
        return orderRepository.findBySymbol(symbol);
    }

    @Transactional
    public Order createOrder(OrderRequest request) {
        validateOrderRequest(request);

        Order order = new Order();
        order.setSymbol(request.getSymbol().toUpperCase());
        order.setSide(request.getSide());
        order.setType(request.getType());
        order.setQuantity(request.getQuantity());
        order.setPrice(request.getPrice());
        order.setStopPrice(request.getStopPrice());
        order.setAccount(request.getAccount());
        order.setTimeInForce(request.getTimeInForce());
        order.setNotes(request.getNotes());
        order.setStatus(OrderStatus.OPEN);

        Order savedOrder = orderRepository.save(order);

        if (request.getType() == OrderType.MARKET) {
            simulateMarketFill(savedOrder);
        }

        return savedOrder;
    }

    @Transactional
    public Order cancelOrder(Long id) {
        Order order = getOrderById(id);
        if (order.getStatus() == OrderStatus.FILLED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
        }
        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    @Transactional
    public Order executeOrder(Long id) {
        Order order = getOrderById(id);
        if (order.getStatus() != OrderStatus.OPEN && order.getStatus() != OrderStatus.PARTIALLY_FILLED) {
            throw new RuntimeException("Cannot execute order with status: " + order.getStatus());
        }
        simulateMarketFill(order);
        return order;
    }

    private void simulateMarketFill(Order order) {
        double fillPrice;
        if (order.getPrice() != null) {
            double variance = order.getPrice() * 0.002;
            fillPrice = order.getPrice() + (random.nextDouble() * 2 - 1) * variance;
        } else {
            fillPrice = generateSimulatedPrice(order.getSymbol());
        }
        fillPrice = Math.round(fillPrice * 100.0) / 100.0;

        int remainingQty = order.getQuantity() - order.getFilledQuantity();

        Trade trade = new Trade();
        trade.setOrder(order);
        trade.setSymbol(order.getSymbol());
        trade.setSide(order.getSide());
        trade.setQuantity(remainingQty);
        trade.setPrice(fillPrice);
        trade.setAccount(order.getAccount());
        trade.setCommission(Math.round(remainingQty * fillPrice * 0.0001 * 100.0) / 100.0);
        tradeRepository.save(trade);

        int totalFilled = order.getFilledQuantity() + remainingQty;
        double totalCost = (order.getAvgFillPrice() != null ? order.getAvgFillPrice() * order.getFilledQuantity() : 0)
                + fillPrice * remainingQty;
        double newAvgFillPrice = Math.round(totalCost / totalFilled * 100.0) / 100.0;

        order.setFilledQuantity(totalFilled);
        order.setAvgFillPrice(newAvgFillPrice);
        order.setStatus(totalFilled >= order.getQuantity() ? OrderStatus.FILLED : OrderStatus.PARTIALLY_FILLED);
        if (order.getStatus() == OrderStatus.FILLED) {
            order.setFilledAt(LocalDateTime.now());
        }
        orderRepository.save(order);

        updatePosition(order.getSymbol(), order.getSide(), remainingQty, fillPrice, order.getAccount());
    }

    private void updatePosition(String symbol, OrderSide side, int quantity, double price, String account) {
        Position position = positionRepository.findBySymbol(symbol).orElse(null);

        if (position == null) {
            position = new Position();
            position.setSymbol(symbol);
            position.setAccount(account);
            position.setQuantity(side == OrderSide.BUY ? quantity : -quantity);
            position.setAvgCost(price);
            position.setCurrentPrice(price);
            position.setMarketValue(position.getQuantity() * price);
            position.setUnrealizedPnl(0.0);
            position.setRealizedPnl(0.0);
        } else {
            int currentQty = position.getQuantity();
            int newQty;
            if (side == OrderSide.BUY) {
                newQty = currentQty + quantity;
                if (currentQty >= 0) {
                    double totalCost = position.getAvgCost() * currentQty + price * quantity;
                    position.setAvgCost(Math.round(totalCost / newQty * 100.0) / 100.0);
                } else {
                    double realized = (price - position.getAvgCost()) * Math.min(quantity, Math.abs(currentQty)) * -1;
                    position.setRealizedPnl(Math.round((position.getRealizedPnl() + realized) * 100.0) / 100.0);
                    if (newQty > 0) {
                        position.setAvgCost(price);
                    }
                }
            } else {
                newQty = currentQty - quantity;
                if (currentQty > 0) {
                    double realized = (price - position.getAvgCost()) * Math.min(quantity, currentQty);
                    position.setRealizedPnl(Math.round((position.getRealizedPnl() + realized) * 100.0) / 100.0);
                    if (newQty < 0) {
                        position.setAvgCost(price);
                    }
                } else {
                    double totalCost = position.getAvgCost() * Math.abs(currentQty) + price * quantity;
                    position.setAvgCost(Math.round(totalCost / Math.abs(newQty) * 100.0) / 100.0);
                }
            }
            position.setQuantity(newQty);
            position.setCurrentPrice(price);
            position.setMarketValue(Math.round(newQty * price * 100.0) / 100.0);
            position.setUnrealizedPnl(Math.round(newQty * (price - position.getAvgCost()) * 100.0) / 100.0);
        }

        positionRepository.save(position);
    }

    private double generateSimulatedPrice(String symbol) {
        return switch (symbol.toUpperCase()) {
            case "AAPL" -> 175.0 + random.nextDouble() * 10;
            case "GOOGL" -> 140.0 + random.nextDouble() * 10;
            case "MSFT" -> 420.0 + random.nextDouble() * 15;
            case "AMZN" -> 185.0 + random.nextDouble() * 10;
            case "TSLA" -> 245.0 + random.nextDouble() * 20;
            case "META" -> 500.0 + random.nextDouble() * 20;
            case "NVDA" -> 880.0 + random.nextDouble() * 30;
            case "JPM" -> 195.0 + random.nextDouble() * 10;
            case "V" -> 280.0 + random.nextDouble() * 10;
            case "JNJ" -> 155.0 + random.nextDouble() * 5;
            default -> 100.0 + random.nextDouble() * 50;
        };
    }

    private void validateOrderRequest(OrderRequest request) {
        if ((request.getType() == OrderType.LIMIT || request.getType() == OrderType.STOP_LIMIT)
                && request.getPrice() == null) {
            throw new RuntimeException("Price is required for LIMIT and STOP_LIMIT orders");
        }
        if ((request.getType() == OrderType.STOP || request.getType() == OrderType.STOP_LIMIT)
                && request.getStopPrice() == null) {
            throw new RuntimeException("Stop price is required for STOP and STOP_LIMIT orders");
        }
    }
}
