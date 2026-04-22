package com.tradingoms.controller;

import com.tradingoms.dto.OrderRequest;
import com.tradingoms.dto.OrderResponse;
import com.tradingoms.model.Order;
import com.tradingoms.model.OrderStatus;
import com.tradingoms.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String symbol) {
        List<Order> orders;
        if (status != null) {
            orders = orderService.getOrdersByStatus(OrderStatus.valueOf(status.toUpperCase()));
        } else if (symbol != null) {
            orders = orderService.getOrdersBySymbol(symbol.toUpperCase());
        } else {
            orders = orderService.getAllOrders();
        }
        return ResponseEntity.ok(orders.stream().map(OrderResponse::fromEntity).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(OrderResponse.fromEntity(orderService.getOrderById(id)));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(OrderResponse.fromEntity(order));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(OrderResponse.fromEntity(orderService.cancelOrder(id)));
    }

    @PostMapping("/{id}/execute")
    public ResponseEntity<OrderResponse> executeOrder(@PathVariable Long id) {
        return ResponseEntity.ok(OrderResponse.fromEntity(orderService.executeOrder(id)));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}
