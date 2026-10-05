package br.com.carrawave.appapi.playback;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PlaySessionRepository extends JpaRepository<PlaySession, Long> {

    Optional<PlaySession> findByPublicId(UUID publicId);

    List<PlaySession> findByUserIdOrderByStartedAtDesc(Long userId);

    /** Últimas rádios ouvidas (uma linha por rádio), já limitadas pelo banco: [stationId, ultimoInicio]. */
    @Query("select s.stationId, max(s.startedAt) from PlaySession s where s.userId = :userId " +
            "group by s.stationId order by max(s.startedAt) desc")
    List<Object[]> findRecentStations(@Param("userId") Long userId, Pageable pageable);

    @Query("select count(distinct s.userId) from PlaySession s where s.endedAt is null " +
            "and coalesce(s.lastHeartbeatAt, s.startedAt) > :cutoff")
    long countListeningSince(@Param("cutoff") Instant cutoff);

    long countByUserId(Long userId);

    @Query("select s from PlaySession s where s.endedAt is null " +
            "and coalesce(s.lastHeartbeatAt, s.startedAt) < :cutoff")
    List<PlaySession> findOrphanSessions(@Param("cutoff") Instant cutoff);

    @Modifying
    @Transactional
    @Query("update PlaySession s set s.userId = :targetUserId where s.userId = :sourceUserId")
    int reassignUser(@Param("sourceUserId") Long sourceUserId, @Param("targetUserId") Long targetUserId);

    @Query("select s.stationId as stationId, count(distinct s.userId) as listeners " +
            "from PlaySession s where s.stationId in :stationIds and s.endedAt is null " +
            "and coalesce(s.lastHeartbeatAt, s.startedAt) > :cutoff group by s.stationId")
    List<StationListenerCount> countActiveListeners(@Param("stationIds") List<Long> stationIds, @Param("cutoff") Instant cutoff);

    interface StationListenerCount {
        Long getStationId();
        Long getListeners();
    }
}
