package com.tradingoms.controller;

import com.tradingoms.dto.TradeResponse;
import com.tradingoms.model.Trade;
import com.tradingoms.service.TradeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trades")
public class TradeController {

    private final TradeService tradeService;

    public TradeController(TradeService tradeService) {
        this.tradeService = tradeService;
    }

    @GetMapping
    public ResponseEntity<List<TradeResponse>> getAllTrades(
            @RequestParam(required = false) String symbol,
            @RequestParam(required = false) Long orderId) {
        List<Trade> trades;
        if (orderId != null) {
            trades = tradeService.getTradesByOrderId(orderId);
        } else if (symbol != null) {
            trades = tradeService.getTradesBySymbol(symbol.toUpperCase());
        } else {
            trades = tradeService.getAllTrades();
        }
        return ResponseEntity.ok(trades.stream().map(TradeResponse::fromEntity).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TradeResponse> getTradeById(@PathVariable Long id) {
        return ResponseEntity.ok(TradeResponse.fromEntity(tradeService.getTradeById(id)));
    }
}
