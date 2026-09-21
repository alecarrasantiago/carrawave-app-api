package br.com.carrawave.appapi.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface FavoriteRepository extends JpaRepository<Favorite, Favorite.FavoriteId> {
    List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("select f.stationId from Favorite f where f.userId = :userId")
    Set<Long> findStationIdsByUserId(@Param("userId") Long userId);

    long countByUserId(Long userId);

    void deleteByUserIdAndStationId(Long userId, Long stationId);

    boolean existsByUserIdAndStationId(Long userId, Long stationId);
}
