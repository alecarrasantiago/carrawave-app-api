package br.com.carrawave.appapi.stats;

import br.com.carrawave.appapi.playback.PlaySessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Conta quem está "online" (app aberto) e quem está ouvindo.
 *
 * - online: cada aparelho avisa que está com o app aberto a cada ~60 s
 *   (POST /api/v1/stats/presence). Guardamos só em memória — não precisa de
 *   banco, e se o servidor reiniciar o número se reconstrói em 1 minuto.
 *   Conta como online quem avisou nos últimos 2,5 min.
 * - listening: sessões de reprodução abertas com heartbeat recente (o app
 *   manda heartbeat a cada 60 s enquanto toca).
 *
 * O resultado fica em cache por 15 s, então muita gente chamando junto não
 * vira muita consulta ao banco.
 */
@Service
public class PresenceService {

    private static final Duration ONLINE_WINDOW = Duration.ofSeconds(150);
    private static final Duration LISTENING_WINDOW = Duration.ofSeconds(150);
    private static final Duration FORGET_AFTER = Duration.ofMinutes(10);
    private static final Duration CACHE_TTL = Duration.ofSeconds(15);

    private final PlaySessionRepository playSessionRepository;
    private final Map<UUID, Instant> lastSeenByDevice = new ConcurrentHashMap<>();

    private volatile OnlineStats cached = new OnlineStats(0, 0);
    private volatile Instant cachedAt = Instant.EPOCH;

    public PresenceService(PlaySessionRepository playSessionRepository) {
        this.playSessionRepository = playSessionRepository;
    }

    public void touch(UUID deviceId) {
        if (deviceId != null) {
            lastSeenByDevice.put(deviceId, Instant.now());
        }
    }

    @Transactional(readOnly = true)
    public OnlineStats snapshot() {
        Instant now = Instant.now();
        if (Duration.between(cachedAt, now).compareTo(CACHE_TTL) < 0) {
            return cached;
        }
        synchronized (this) {
            now = Instant.now();
            if (Duration.between(cachedAt, now).compareTo(CACHE_TTL) < 0) {
                return cached;
            }
            Instant forgetBefore = now.minus(FORGET_AFTER);
            lastSeenByDevice.values().removeIf(seen -> seen.isBefore(forgetBefore));

            Instant onlineSince = now.minus(ONLINE_WINDOW);
            long online = lastSeenByDevice.values().stream().filter(seen -> seen.isAfter(onlineSince)).count();
            long listening = playSessionRepository.countListeningSince(now.minus(LISTENING_WINDOW));

            cached = new OnlineStats(Math.max(online, listening), listening);
            cachedAt = now;
            return cached;
        }
    }
}
