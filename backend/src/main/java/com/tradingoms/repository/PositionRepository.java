package com.tradingoms.repository;

import com.tradingoms.model.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {
    Optional<Position> findBySymbol(String symbol);
    List<Position> findByAccount(String account);
    List<Position> findByQuantityNot(Integer quantity);
}
