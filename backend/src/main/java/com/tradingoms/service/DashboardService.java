package com.tradingoms.service;

import com.tradingoms.dto.DashboardStats;
import com.tradingoms.model.OrderStatus;
import com.tradingoms.model.Position;
import com.tradingoms.repository.OrderRepository;
import com.tradingoms.repository.PositionRepository;
import com.tradingoms.repository.TradeRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class DashboardService {

    private final OrderRepository orderRepository;
    private final TradeRepository tradeRepository;
    private final PositionRepository positionRepository;

    public DashboardService(OrderRepository orderRepository, TradeRepository tradeRepository,
                            PositionRepository positionRepository) {
        this.orderRepository = orderRepository;
        this.tradeRepository = tradeRepository;
        this.positionRepository = positionRepository;
    }

    public DashboardStats getStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalOrders(orderRepository.count());
        stats.setOpenOrders(orderRepository.countByStatus(OrderStatus.OPEN)
                + orderRepository.countByStatus(OrderStatus.PARTIALLY_FILLED)
                + orderRepository.countByStatus(OrderStatus.PENDING));
        stats.setFilledOrders(orderRepository.countByStatus(OrderStatus.FILLED));
        stats.setCancelledOrders(orderRepository.countByStatus(OrderStatus.CANCELLED));
        stats.setTotalTrades(tradeRepository.count());

        List<Position> activePositions = positionRepository.findByQuantityNot(0);
        stats.setTotalPositions(activePositions.size());

        double totalMarketValue = 0;
        double totalUnrealizedPnl = 0;
        double totalRealizedPnl = 0;

        for (Position position : activePositions) {
            if (position.getMarketValue() != null) {
                totalMarketValue += Math.abs(position.getMarketValue());
            }
            if (position.getUnrealizedPnl() != null) {
                totalUnrealizedPnl += position.getUnrealizedPnl();
            }
            if (position.getRealizedPnl() != null) {
                totalRealizedPnl += position.getRealizedPnl();
            }
        }

        stats.setTotalMarketValue(Math.round(totalMarketValue * 100.0) / 100.0);
        stats.setTotalUnrealizedPnl(Math.round(totalUnrealizedPnl * 100.0) / 100.0);
        stats.setTotalRealizedPnl(Math.round(totalRealizedPnl * 100.0) / 100.0);

        return stats;
    }
}
