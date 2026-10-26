package br.com.carrawave.appapi.playback;

import br.com.carrawave.appapi.catalog.Station;
import br.com.carrawave.appapi.catalog.StationRepository;
import br.com.carrawave.appapi.common.ApiException;
import br.com.carrawave.appapi.common.Uuid7;
import br.com.carrawave.appapi.playback.dto.HeartbeatRequest;
import br.com.carrawave.appapi.playback.dto.StartPlaybackRequest;
import br.com.carrawave.appapi.playback.dto.StartPlaybackResponse;
import br.com.carrawave.appapi.playback.dto.StopPlaybackRequest;
import br.com.carrawave.appapi.security.AuthenticatedUser;
import br.com.carrawave.appapi.user.AppUser;
import br.com.carrawave.appapi.user.AppUserRepository;
import br.com.carrawave.appapi.user.Device;
import br.com.carrawave.appapi.user.DeviceRepository;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class PlaybackService {

    private static final Logger log = LoggerFactory.getLogger(PlaybackService.class);

    private final PlaySessionRepository playSessionRepository;
    private final AppUserRepository appUserRepository;
    private final DeviceRepository deviceRepository;
    private final StationRepository stationRepository;
    private final ListeningTracker tracker;
    private final TransactionTemplate transactionTemplate;

    public PlaybackService(
            PlaySessionRepository playSessionRepository,
            AppUserRepository appUserRepository,
            DeviceRepository deviceRepository,
            StationRepository stationRepository,
            ListeningTracker tracker,
            TransactionTemplate transactionTemplate
    ) {
        this.tracker = tracker;
        this.transactionTemplate = transactionTemplate;
        this.playSessionRepository = playSessionRepository;
        this.appUserRepository = appUserRepository;
        this.deviceRepository = deviceRepository;
        this.stationRepository = stationRepository;
    }

    @Transactional
    public StartPlaybackResponse start(AuthenticatedUser principal, StartPlaybackRequest request) {
        AppUser user = resolveUser(principal);
        Device device = resolveDevice(principal);
        Station station = stationRepository.findByPublicId(request.stationId())
                .orElseThrow(ApiException::stationNotFound);

        PlaySession session = new PlaySession();
        session.setPublicId(Uuid7.generate());
        session.setUserId(user.getId());
        session.setDeviceId(device.getId());
        session.setStationId(station.getId());
        session.setSource(request.source());
        session.setStartedAt(request.startedAt());
        session.setLastHeartbeatAt(request.startedAt());
        playSessionRepository.save(session);
        tracker.register(session.getPublicId(), principal.userId(), principal.deviceId(),
                station.getId(), Instant.now(), 0);

        return new StartPlaybackResponse(session.getPublicId());
    }

    /**
     * Heartbeat (a cada ~60 s enquanto toca) NÃO vai mais ao banco: só
     * atualiza a sessão em memória. Assim o Neon pode dormir mesmo com gente
     * ouvindo. O banco só é consultado se a sessão não está em memória
     * (servidor reiniciou ou a sessão tinha expirado).
     */
    @Transactional
    public void heartbeat(AuthenticatedUser principal, UUID sessionId, HeartbeatRequest request) {
        ListeningTracker.Active active = tracker.get(sessionId);
        if (active != null) {
            if (!active.isOwnedBy(principal.userId(), principal.deviceId())) {
                throw ApiException.sessionNotFound();
            }
            tracker.heartbeat(active, request.playedSeconds());
            return;
        }
        // Não está em memória: carrega do banco uma vez e volta a acompanhar.
        PlaySession session = resolveOwnedSession(principal, sessionId);
        Instant now = Instant.now();
        session.setPlayedSeconds(request.playedSeconds());
        session.setLastHeartbeatAt(now);
        session.setEndedAt(null);
        session.setEndReason(null);
        playSessionRepository.save(session);
        tracker.register(session.getPublicId(), principal.userId(), principal.deviceId(),
                session.getStationId(), now, request.playedSeconds());
    }

    @Transactional
    public void stop(AuthenticatedUser principal, UUID sessionId, StopPlaybackRequest request) {
        ListeningTracker.Active active = tracker.get(sessionId);
        if (active != null && !active.isOwnedBy(principal.userId(), principal.deviceId())) {
            throw ApiException.sessionNotFound();
        }
        PlaySession session = resolveOwnedSession(principal, sessionId);
        tracker.remove(sessionId);
        session.setPlayedSeconds(request.playedSeconds());
        session.setLastHeartbeatAt(Instant.now());
        session.setEndedAt(Instant.now());
        session.setEndReason(request.reason());
        playSessionRepository.save(session);
    }

    /**
     * Fecha sessões "órfãs" — sem heartbeat há mais de 5 minutos — porque o
     * cliente pode ter morrido (app crashou, conexão caiu) sem avisar /stop.
     * A verificação é em memória: o banco só é tocado se houver algo pra fechar.
     */
    @Scheduled(fixedDelay = 5 * 60_000)
    @Transactional
    public void closeOrphanSessions() {
        List<ListeningTracker.Active> stale = tracker.removeStale(Instant.now().minus(Duration.ofMinutes(5)));
        if (stale.isEmpty()) {
            return;
        }
        Instant now = Instant.now();
        for (ListeningTracker.Active a : stale) {
            playSessionRepository.findByPublicId(a.publicId()).ifPresent(session -> {
                session.setPlayedSeconds(a.playedSeconds());
                session.setLastHeartbeatAt(a.lastHeartbeatAt());
                session.setEndedAt(now);
                session.setEndReason("TIMEOUT");
                playSessionRepository.save(session);
            });
        }
        log.info("Fechadas {} sessões de reprodução órfãs", stale.size());
    }

    /**
     * Uma única vez, 10 min depois de subir: fecha sessões que ficaram abertas
     * no banco de antes de um reinício e cujo app não voltou a mandar heartbeat.
     */
    @Scheduled(initialDelay = 10 * 60_000, fixedDelay = Long.MAX_VALUE)
    @Transactional
    public void closeSessionsLeftOpenBeforeRestart() {
        Instant cutoff = Instant.now().minus(Duration.ofMinutes(10));
        var leftovers = playSessionRepository.findOrphanSessions(cutoff).stream()
                .filter(s -> tracker.get(s.getPublicId()) == null)
                .toList();
        for (PlaySession session : leftovers) {
            session.setEndedAt(Instant.now());
            session.setEndReason("TIMEOUT");
        }
        if (!leftovers.isEmpty()) {
            playSessionRepository.saveAll(leftovers);
            log.info("Fechadas {} sessões abertas antes do reinício", leftovers.size());
        }
    }

    /** No desligamento (deploy/reinício), grava o progresso das sessões em memória. */
    @PreDestroy
    public void flushOnShutdown() {
        var active = tracker.all();
        if (active.isEmpty()) {
            return;
        }
        try {
            transactionTemplate.executeWithoutResult(status -> {
                for (ListeningTracker.Active a : active) {
                    playSessionRepository.findByPublicId(a.publicId()).ifPresent(session -> {
                        session.setPlayedSeconds(a.playedSeconds());
                        session.setLastHeartbeatAt(a.lastHeartbeatAt());
                        playSessionRepository.save(session);
                    });
                }
            });
        } catch (Exception e) {
            log.warn("Não foi possível gravar as sessões abertas no desligamento: {}", e.toString());
        }
    }

    private PlaySession resolveOwnedSession(AuthenticatedUser principal, UUID sessionId) {
        AppUser user = resolveUser(principal);
        PlaySession session = playSessionRepository.findByPublicId(sessionId)
                .orElseThrow(ApiException::sessionNotFound);
        // Nunca deixar um usuário mexer na sessão de outro — mesmo que ele
        // tenha adivinhado/enumerado um sessionId válido.
        if (!session.getUserId().equals(user.getId())) {
            throw ApiException.sessionNotFound();
        }
        return session;
    }

    private AppUser resolveUser(AuthenticatedUser principal) {
        return appUserRepository.findByPublicId(principal.userId())
                .orElseThrow(() -> new IllegalStateException("Usuário autenticado não encontrado — token inconsistente."));
    }

    private Device resolveDevice(AuthenticatedUser principal) {
        return deviceRepository.findByDeviceId(principal.deviceId())
                .orElseThrow(() -> new IllegalStateException("Device não encontrado — chame /auth/anonymous primeiro."));
    }
}
