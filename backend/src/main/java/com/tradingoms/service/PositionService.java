package com.tradingoms.service;

import com.tradingoms.model.Position;
import com.tradingoms.repository.PositionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PositionService {

    private final PositionRepository positionRepository;

    public PositionService(PositionRepository positionRepository) {
        this.positionRepository = positionRepository;
    }

    public List<Position> getAllPositions() {
        return positionRepository.findAll();
    }

    public List<Position> getActivePositions() {
        return positionRepository.findByQuantityNot(0);
    }

    public Position getPositionById(Long id) {
        return positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found with id: " + id));
    }

    public Position getPositionBySymbol(String symbol) {
        return positionRepository.findBySymbol(symbol)
                .orElseThrow(() -> new RuntimeException("Position not found for symbol: " + symbol));
    }
}
