package br.com.carrawave.appapi.user;

import br.com.carrawave.appapi.catalog.Station;
import br.com.carrawave.appapi.catalog.StationRepository;
import br.com.carrawave.appapi.catalog.dto.CitySummary;
import br.com.carrawave.appapi.catalog.dto.GenreSummary;
import br.com.carrawave.appapi.catalog.dto.StationSummary;
import br.com.carrawave.appapi.common.ApiException;
import br.com.carrawave.appapi.playback.PlaySession;
import br.com.carrawave.appapi.playback.PlaySessionRepository;
import br.com.carrawave.appapi.security.AuthenticatedUser;
import br.com.carrawave.appapi.user.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MeService {

    private final AppUserRepository appUserRepository;
    private final FavoriteRepository favoriteRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final StationRepository stationRepository;
    private final PlaySessionRepository playSessionRepository;

    public MeService(
            AppUserRepository appUserRepository,
            FavoriteRepository favoriteRepository,
            UserSettingsRepository userSettingsRepository,
            StationRepository stationRepository,
            PlaySessionRepository playSessionRepository
    ) {
        this.appUserRepository = appUserRepository;
        this.favoriteRepository = favoriteRepository;
        this.userSettingsRepository = userSettingsRepository;
        this.stationRepository = stationRepository;
        this.playSessionRepository = playSessionRepository;
    }

    @Transactional(readOnly = true)
    public MeResponse getMe(AuthenticatedUser principal) {
        AppUser user = resolveUser(principal);
        long favoriteCount = favoriteRepository.countByUserId(user.getId());
        String anonymousLabel = user.isAnonymous()
                ? "CW-" + principal.deviceId().toString().replace("-", "").substring(0, 8).toUpperCase()
                : null;

        return new MeResponse(
                user.getPublicId(), user.getAccountType(), user.getDisplayName(), user.getEmail(),
                principal.deviceId(), anonymousLabel, favoriteCount, user.getCreatedAt());
    }

    @Transactional
    public MeResponse updateMe(AuthenticatedUser principal, UpdateMeRequest request) {
        AppUser user = resolveUser(principal);
        if (user.isAnonymous()) {
            throw ApiException.actionNotAllowedForAnonymous();
        }
        user.setDisplayName(request.displayName());
        appUserRepository.save(user);
        return getMe(principal);
    }

    @Transactional(readOnly = true)
    public List<StationSummary> getFavorites(AuthenticatedUser principal) {
        AppUser user = resolveUser(principal);
        List<Favorite> favorites = favoriteRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<Long> stationIds = favorites.stream().map(Favorite::getStationId).toList();
        Map<Long, Station> stations = stationRepository.findAllById(stationIds).stream()
                .collect(Collectors.toMap(Station::getId, s -> s));

        return stationIds.stream()
                .map(stations::get)
                .filter(Objects::nonNull)
                .map(s -> toSummary(s, true))
                .toList();
    }

    @Transactional
    public void addFavorite(AuthenticatedUser principal, UUID stationPublicId) {
        AppUser user = resolveUser(principal);
        Station station = stationRepository.findByPublicId(stationPublicId).orElseThrow(ApiException::stationNotFound);
        if (!favoriteRepository.existsByUserIdAndStationId(user.getId(), station.getId())) {
            favoriteRepository.save(new Favorite(user.getId(), station.getId()));
        }
    }

    @Transactional
    public void removeFavorite(AuthenticatedUser principal, UUID stationPublicId) {
        AppUser user = resolveUser(principal);
        Station station = stationRepository.findByPublicId(stationPublicId).orElseThrow(ApiException::stationNotFound);
        favoriteRepository.deleteByUserIdAndStationId(user.getId(), station.getId());
    }

    @Transactional(readOnly = true)
    public List<HistoryItem> getHistory(AuthenticatedUser principal, int size) {
        AppUser user = resolveUser(principal);
        List<PlaySession> sessions = playSessionRepository.findByUserIdOrderByStartedAtDesc(user.getId());

        LinkedHashMap<Long, Instant> lastPlayedByStation = new LinkedHashMap<>();
        for (PlaySession session : sessions) {
            lastPlayedByStation.putIfAbsent(session.getStationId(), session.getStartedAt());
            if (lastPlayedByStation.size() >= size) break;
        }

        Map<Long, Station> stations = stationRepository.findAllById(lastPlayedByStation.keySet()).stream()
                .collect(Collectors.toMap(Station::getId, s -> s));

        return lastPlayedByStation.entrySet().stream()
                .map(e -> {
                    Station station = stations.get(e.getKey());
                    if (station == null) return null;
                    return new HistoryItem(toSummary(station, favoriteRepository.existsByUserIdAndStationId(user.getId(), station.getId())), e.getValue());
                })
                .filter(Objects::nonNull)
                .toList();
    }

    @Transactional(readOnly = true)
    public SettingsResponse getSettings(AuthenticatedUser principal) {
        AppUser user = resolveUser(principal);
        UserSettings settings = userSettingsRepository.findByUserId(user.getId())
                .orElseGet(() -> userSettingsRepository.save(new UserSettings(user.getId())));
        return new SettingsResponse(settings.getTheme(), settings.getAudioQuality(), settings.isAutoplay(), settings.getSleepTimerMinutes());
    }

    @Transactional
    public SettingsResponse updateSettings(AuthenticatedUser principal, UpdateSettingsRequest request) {
        AppUser user = resolveUser(principal);
        UserSettings settings = userSettingsRepository.findByUserId(user.getId())
                .orElseGet(() -> new UserSettings(user.getId()));

        if (request.theme() != null) settings.setTheme(request.theme());
        if (request.audioQuality() != null) settings.setAudioQuality(request.audioQuality());
        if (request.autoplay() != null) settings.setAutoplay(request.autoplay());
        settings.setSleepTimerMinutes(request.sleepTimerMinutes());

        userSettingsRepository.save(settings);
        return getSettings(principal);
    }

    private AppUser resolveUser(AuthenticatedUser principal) {
        return appUserRepository.findByPublicId(principal.userId())
                .orElseThrow(() -> new IllegalStateException("Usuário autenticado não encontrado — token inconsistente."));
    }

    private StationSummary toSummary(Station station, boolean favorited) {
        List<GenreSummary> genres = station.getGenres().stream().map(GenreSummary::from).toList();
        return new StationSummary(
                station.getPublicId(), station.getName(), station.getSlug(), station.getFrequency(),
                CitySummary.from(station.getCity()), genres, station.getStreamUrl(), station.getStreamFormat(),
                station.getArtworkUrl(), station.getArtworkColor(), station.getInitials(), station.getWebsite(),
                station.getDescription(), station.isActive(), null, favorited);
    }
}
