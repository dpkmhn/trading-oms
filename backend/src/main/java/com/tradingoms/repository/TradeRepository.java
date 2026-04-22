package com.tradingoms.repository;

import com.tradingoms.model.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Long> {
    List<Trade> findByOrderId(Long orderId);
    List<Trade> findBySymbol(String symbol);
    List<Trade> findByAccount(String account);
    List<Trade> findAllByOrderByExecutedAtDesc();
}
