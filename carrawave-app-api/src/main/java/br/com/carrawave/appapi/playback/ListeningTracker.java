package br.com.carrawave.appapi.playback;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

/**
 * Sessões de reprodução abertas, guardadas EM MEMÓRIA.
 *
 * Por quê: o app manda um heartbeat a cada 60 s enquanto toca. Antes, cada
 * heartbeat era um UPDATE no banco, e os contadores de "ouvindo agora" eram
 * consultas no banco. Com qualquer pessoa ouvindo, o Neon nunca ficava 5 min
 * parado e nunca dormia, e a cota grátis de compute acabava no meio do mês.
 *
 * Agora o banco só é tocado quando a sessão começa (INSERT) e quando termina
 * (UPDATE no /stop ou quando o heartbeat para de chegar). Heartbeats e
 * contadores ficam aqui.
 */
@Component
public class ListeningTracker {

    /** Dados mínimos de uma sessão aberta. Mutável só via métodos sincronizados. */
    public static final class Active {
        final UUID publicId;
        final UUID ownerUserId;
        final UUID ownerDeviceId;
        final long stationId;
        volatile Instant lastHeartbeatAt;
        volatile int playedSeconds;

        Active(UUID publicId, UUID ownerUserId, UUID ownerDeviceId, long stationId, Instant lastHeartbeatAt, int playedSeconds) {
            this.publicId = publicId;
            this.ownerUserId = ownerUserId;
            this.ownerDeviceId = ownerDeviceId;
            this.stationId = stationId;
            this.lastHeartbeatAt = lastHeartbeatAt;
            this.playedSeconds = playedSeconds;
        }

        public UUID publicId() { return publicId; }
        public long stationId() { return stationId; }
        public Instant lastHeartbeatAt() { return lastHeartbeatAt; }
        public int playedSeconds() { return playedSeconds; }

        boolean isOwnedBy(UUID userId, UUID deviceId) {
            // O deviceId não muda quando o usuário anônimo faz login (o
            // userId muda, porque as sessões são migradas pro usuário novo).
            return (deviceId != null && deviceId.equals(ownerDeviceId))
                    || (userId != null && userId.equals(ownerUserId));
        }
    }

    private final Map<UUID, Active> sessions = new ConcurrentHashMap<>();

    public void register(UUID publicId, UUID userId, UUID deviceId, long stationId, Instant lastHeartbeatAt, int playedSeconds) {
        sessions.put(publicId, new Active(publicId, userId, deviceId, stationId, lastHeartbeatAt, playedSeconds));
    }

    /** @return a sessão, ou null se não está em memória (ex.: servidor reiniciou). */
    public Active get(UUID publicId) {
        return sessions.get(publicId);
    }

    public Active remove(UUID publicId) {
        return sessions.remove(publicId);
    }

    public void heartbeat(Active session, int playedSeconds) {
        session.playedSeconds = playedSeconds;
        session.lastHeartbeatAt = Instant.now();
    }

    /** Remove e devolve as sessões sem heartbeat desde {@code cutoff}. */
    public List<Active> removeStale(Instant cutoff) {
        List<Active> stale = new ArrayList<>();
        sessions.values().removeIf(s -> {
            if (s.lastHeartbeatAt.isBefore(cutoff)) {
                stale.add(s);
                return true;
            }
            return false;
        });
        return stale;
    }

    public Collection<Active> all() {
        return List.copyOf(sessions.values());
    }

    /** Quantos aparelhos distintos estão ouvindo (heartbeat depois de {@code since}). */
    public long countListening(Instant since) {
        Set<UUID> devices = new HashSet<>();
        for (Active s : sessions.values()) {
            if (s.lastHeartbeatAt.isAfter(since)) {
                devices.add(s.ownerDeviceId);
            }
        }
        return devices.size();
    }

    /** Ouvintes por rádio (só as que têm alguém), para as rádios pedidas. */
    public Map<Long, Long> listenersByStation(Collection<Long> stationIds, Duration window) {
        if (sessions.isEmpty() || stationIds.isEmpty()) {
            return Map.of();
        }
        Set<Long> wanted = new HashSet<>(stationIds);
        Instant since = Instant.now().minus(window);
        Map<Long, Set<UUID>> devicesByStation = new HashMap<>();
        for (Active s : sessions.values()) {
            if (wanted.contains(s.stationId) && s.lastHeartbeatAt.isAfter(since)) {
                devicesByStation.computeIfAbsent(s.stationId, k -> new HashSet<>()).add(s.ownerDeviceId);
            }
        }
        Map<Long, Long> result = new HashMap<>();
        devicesByStation.forEach((station, devices) -> result.put(station, (long) devices.size()));
        return result;
    }
}
