package com.tradingoms.repository;

import com.tradingoms.model.Order;
import com.tradingoms.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatusIn(List<OrderStatus> statuses);
    List<Order> findBySymbol(String symbol);
    List<Order> findByAccount(String account);
    List<Order> findByStatus(OrderStatus status);
    long countByStatus(OrderStatus status);
    List<Order> findAllByOrderByCreatedAtDesc();
}
