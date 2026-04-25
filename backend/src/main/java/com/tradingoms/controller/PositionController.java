package com.tradingoms.controller;

import com.tradingoms.dto.PositionResponse;
import com.tradingoms.model.Position;
import com.tradingoms.service.PositionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
public class PositionController {

    private final PositionService positionService;

    public PositionController(PositionService positionService) {
        this.positionService = positionService;
    }

    @GetMapping
    public ResponseEntity<List<PositionResponse>> getAllPositions(
            @RequestParam(required = false, defaultValue = "false") boolean activeOnly) {
        List<Position> positions = activeOnly
                ? positionService.getActivePositions()
                : positionService.getAllPositions();
        return ResponseEntity.ok(positions.stream().map(PositionResponse::fromEntity).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PositionResponse> getPositionById(@PathVariable Long id) {
        return ResponseEntity.ok(PositionResponse.fromEntity(positionService.getPositionById(id)));
    }

    @GetMapping("/symbol/{symbol}")
    public ResponseEntity<PositionResponse> getPositionBySymbol(@PathVariable String symbol) {
        return ResponseEntity.ok(PositionResponse.fromEntity(positionService.getPositionBySymbol(symbol.toUpperCase())));
    }
}
