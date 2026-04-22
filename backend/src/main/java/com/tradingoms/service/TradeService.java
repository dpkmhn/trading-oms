package com.tradingoms.service;

import com.tradingoms.model.Trade;
import com.tradingoms.repository.TradeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TradeService {

    private final TradeRepository tradeRepository;

    public TradeService(TradeRepository tradeRepository) {
        this.tradeRepository = tradeRepository;
    }

    public List<Trade> getAllTrades() {
        return tradeRepository.findAllByOrderByExecutedAtDesc();
    }

    public Trade getTradeById(Long id) {
        return tradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trade not found with id: " + id));
    }

    public List<Trade> getTradesByOrderId(Long orderId) {
        return tradeRepository.findByOrderId(orderId);
    }

    public List<Trade> getTradesBySymbol(String symbol) {
        return tradeRepository.findBySymbol(symbol);
    }
}
