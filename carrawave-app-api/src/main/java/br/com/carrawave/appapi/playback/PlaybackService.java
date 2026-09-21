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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
public class PlaybackService {

    private static final Logger log = LoggerFactory.getLogger(PlaybackService.class);

    private final PlaySessionRepository playSessionRepository;
    private final AppUserRepository appUserRepository;
    private final DeviceRepository deviceRepository;
    private final StationRepository stationRepository;

    public PlaybackService(
            PlaySessionRepository playSessionRepository,
            AppUserRepository appUserRepository,
            DeviceRepository deviceRepository,
            StationRepository stationRepository
    ) {
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

        return new StartPlaybackResponse(session.getPublicId());
    }

    @Transactional
    public void heartbeat(AuthenticatedUser principal, UUID sessionId, HeartbeatRequest request) {
        PlaySession session = resolveOwnedSession(principal, sessionId);
        session.setPlayedSeconds(request.playedSeconds());
        session.setLastHeartbeatAt(Instant.now());
        playSessionRepository.save(session);
    }

    @Transactional
    public void stop(AuthenticatedUser principal, UUID sessionId, StopPlaybackRequest request) {
        PlaySession session = resolveOwnedSession(principal, sessionId);
        session.setPlayedSeconds(request.playedSeconds());
        session.setEndedAt(Instant.now());
        session.setEndReason(request.reason());
        playSessionRepository.save(session);
    }

    /**
     * Fecha sessões "órfãs" — sem heartbeat há mais de 5 minutos — porque o
     * cliente pode ter morrido (app crashou, conexão caiu) sem avisar /stop.
     */
    @Scheduled(fixedDelay = 5 * 60_000)
    @Transactional
    public void closeOrphanSessions() {
        Instant cutoff = Instant.now().minus(Duration.ofMinutes(5));
        var orphans = playSessionRepository.findOrphanSessions(cutoff);
        for (PlaySession session : orphans) {
            session.setEndedAt(Instant.now());
            session.setEndReason("TIMEOUT");
        }
        if (!orphans.isEmpty()) {
            playSessionRepository.saveAll(orphans);
            log.info("Fechadas {} sessões de reprodução órfãs", orphans.size());
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
