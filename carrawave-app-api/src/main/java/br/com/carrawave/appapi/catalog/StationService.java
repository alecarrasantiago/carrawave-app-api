package br.com.carrawave.appapi.catalog;

import br.com.carrawave.appapi.catalog.dto.*;
import br.com.carrawave.appapi.common.ApiException;
import br.com.carrawave.appapi.playback.PlaySessionRepository;
import br.com.carrawave.appapi.security.AuthenticatedUser;
import br.com.carrawave.appapi.user.AppUser;
import br.com.carrawave.appapi.user.AppUserRepository;
import br.com.carrawave.appapi.user.FavoriteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StationService {

    private static final Logger log = LoggerFactory.getLogger(StationService.class);

    private final StationRepository stationRepository;
    private final CityRepository cityRepository;
    private final GenreRepository genreRepository;
    private final FavoriteRepository favoriteRepository;
    private final PlaySessionRepository playSessionRepository;
    private final AppUserRepository appUserRepository;

    public StationService(
            StationRepository stationRepository,
            CityRepository cityRepository,
            GenreRepository genreRepository,
            FavoriteRepository favoriteRepository,
            PlaySessionRepository playSessionRepository,
            AppUserRepository appUserRepository
    ) {
        this.stationRepository = stationRepository;
        this.cityRepository = cityRepository;
        this.genreRepository = genreRepository;
        this.favoriteRepository = favoriteRepository;
        this.playSessionRepository = playSessionRepository;
        this.appUserRepository = appUserRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<StationSummary> search(String cityParam, String stateParam, String genreParam,
                                                String q, Boolean onlyLive, String sort,
                                                Pageable pageable, AuthenticatedUser principal) {
        Specification<Station> spec = Specification.where(StationSpecifications.active());

        if (cityParam != null && !cityParam.isBlank()) {
            spec = spec.and(StationSpecifications.cityIs(UUID.fromString(cityParam)));
        }
        if (stateParam != null && !stateParam.isBlank()) {
            spec = spec.and(StationSpecifications.stateIs(stateParam));
        }
        if (genreParam != null && !genreParam.isBlank()) {
            spec = spec.and(StationSpecifications.genreIs(UUID.fromString(genreParam)));
        }
        if (q != null && !q.isBlank()) {
            spec = spec.and(StationSpecifications.nameOrFrequencyContains(q));
        }
        // onlyLive: no nosso modelo (agregador de streams de terceiros) uma rádio
        // ativa é considerada ao vivo por definição — o filtro é aceito por
        // compatibilidade de contrato mas não restringe além de "active".

        Sort resolvedSort = switch (sort == null ? "popular" : sort) {
            case "name" -> Sort.by(Sort.Direction.ASC, "name");
            case "recent" -> Sort.by(Sort.Direction.DESC, "createdAt");
            default -> Sort.by(Sort.Direction.ASC, "sortWeight");
        };

        Pageable sortedPageable = pageable.getSort().isSorted()
                ? pageable
                : org.springframework.data.domain.PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), resolvedSort);

        Page<Station> page = stationRepository.findAll(spec, sortedPageable);

        Set<Long> favoriteIds = resolveFavoriteStationIds(principal);
        Map<Long, Long> listeners = listenerCounts(page.getContent().stream().map(Station::getId).toList());

        List<StationSummary> content = page.getContent().stream()
                .map(s -> toSummary(s, favoriteIds, listeners))
                .toList();

        return PageResponse.of(page, content);
    }

    @Transactional(readOnly = true)
    public StationDetail getDetail(UUID stationPublicId, AuthenticatedUser principal) {
        Station station = stationRepository.findByPublicId(stationPublicId)
                .orElseThrow(ApiException::stationNotFound);

        Set<Long> favoriteIds = resolveFavoriteStationIds(principal);
        Map<Long, Long> listeners = listenerCounts(List.of(station.getId()));

        List<Station> similarEntities = stationRepository
                .findTop6ByCityIdAndActiveTrueAndIdNot(station.getCity().getId(), station.getId());
        Map<Long, Long> similarListeners = listenerCounts(similarEntities.stream().map(Station::getId).toList());
        List<StationSummary> similar = similarEntities.stream()
                .map(s -> toSummary(s, favoriteIds, similarListeners))
                .toList();

        // Não temos grade de programação própria (agregamos rádios de terceiros),
        // então currentProgram fica nulo por enquanto — campo já modelado no
        // contrato para quando houver integração com a grade de cada emissora.
        return new StationDetail(toSummary(station, favoriteIds, listeners), similar, null);
    }

    public Map<String, Object> getStreamToken(UUID stationPublicId) {
        Station station = stationRepository.findByPublicId(stationPublicId)
                .orElseThrow(ApiException::stationNotFound);
        // Como agregamos streams públicos de terceiros (a própria emissora hospeda
        // o áudio), não há o que assinar de fato — devolvemos a URL real da
        // emissora no mesmo formato do contrato, para o cliente não precisar
        // de dois caminhos diferentes.
        return Map.of(
                "url", station.getStreamUrl(),
                "expiresAt", Instant.now().plus(Duration.ofHours(1)).toString()
        );
    }

    @Cacheable("home")
    @Transactional(readOnly = true)
    public HomeResponse home(AuthenticatedUser principal) {
        Set<Long> favoriteIds = resolveFavoriteStationIds(principal);

        List<Station> allActive = stationRepository.findAll(StationSpecifications.active());
        Map<Long, Long> listeners = listenerCounts(allActive.stream().map(Station::getId).toList());

        List<StationSummary> liveNow = allActive.stream()
                .sorted(Comparator.comparingInt(Station::getSortWeight))
                .limit(6)
                .map(s -> toSummary(s, favoriteIds, listeners))
                .toList();

        List<HomeResponse.Section> sections = new ArrayList<>();
        for (City city : cityRepository.findAll()) {
            List<StationSummary> stations = allActive.stream()
                    .filter(s -> s.getCity().getId().equals(city.getId()))
                    .sorted(Comparator.comparingInt(Station::getSortWeight))
                    .map(s -> toSummary(s, favoriteIds, listeners))
                    .toList();
            if (!stations.isEmpty()) {
                sections.add(new HomeResponse.Section("featured-" + city.getSlug(), "Destaques de " + city.getName(), stations));
            }
        }

        List<StationSummary> mostPlayed = allActive.stream()
                .sorted(Comparator.comparingLong((Station s) -> listeners.getOrDefault(s.getId(), 0L)).reversed())
                .limit(6)
                .map(s -> toSummary(s, favoriteIds, listeners))
                .toList();
        sections.add(new HomeResponse.Section("most-played", "Mais ouvidas", mostPlayed));

        List<GenreSummary> genres = genreRepository.findAll().stream()
                .map(g -> GenreSummary.withCount(g, countStationsWithGenre(g)))
                .filter(g -> g.stationCount() > 0)
                .toList();

        return new HomeResponse(greetingForNow(), liveNow, sections, genres);
    }

    // Cidades e gêneros praticamente não mudam em produção (só via migração +
    // deploy, que já reinicia o processo e limpa esse cache) — cachear evita
    // recalcular essas listas (e suas contagens) a cada abertura do app por
    // cada pessoa.
    @Cacheable("cities")
    public List<CitySummary> cities() {
        return cityRepository.findAll().stream()
                .map(c -> CitySummary.withCount(c, stationRepository.countByCityId(c.getId())))
                .toList();
    }

    @Cacheable("genres")
    public List<GenreSummary> genres() {
        return genreRepository.findAll().stream()
                .map(g -> GenreSummary.withCount(g, countStationsWithGenre(g)))
                .toList();
    }

    @Transactional(readOnly = true)
    public SearchResponse searchAll(String q, AuthenticatedUser principal) {
        if (q == null || q.isBlank()) {
            return new SearchResponse(List.of(), List.of(), List.of());
        }
        Set<Long> favoriteIds = resolveFavoriteStationIds(principal);

        List<Station> stations = stationRepository.findAll(
                Specification.where(StationSpecifications.active()).and(StationSpecifications.nameOrFrequencyContains(q)));
        Map<Long, Long> listeners = listenerCounts(stations.stream().map(Station::getId).toList());
        List<StationSummary> stationResults = stations.stream().map(s -> toSummary(s, favoriteIds, listeners)).toList();

        String likeTerm = q.toLowerCase();
        List<CitySummary> cityResults = cityRepository.findAll().stream()
                .filter(c -> c.getName().toLowerCase().contains(likeTerm))
                .map(CitySummary::from)
                .toList();
        List<GenreSummary> genreResults = genreRepository.findAll().stream()
                .filter(g -> g.getName().toLowerCase().contains(likeTerm))
                .map(GenreSummary::from)
                .toList();

        return new SearchResponse(stationResults, cityResults, genreResults);
    }

    private long countStationsWithGenre(Genre genre) {
        // Antes carregava todas as entidades Station só pra contar (.size())
        // — trocado por um COUNT de verdade no banco, que não precisa trazer
        // nenhuma linha pra memória da aplicação.
        return stationRepository.count(StationSpecifications.active().and(StationSpecifications.genreIs(genre.getPublicId())));
    }

    private String greetingForNow() {
        int hour = java.time.LocalTime.now(java.time.ZoneId.of("America/Sao_Paulo")).getHour();
        if (hour < 12) return "BOM_DIA";
        if (hour < 18) return "BOA_TARDE";
        return "BOA_NOITE";
    }

    private Set<Long> resolveFavoriteStationIds(AuthenticatedUser principal) {
        if (principal == null) {
            return Set.of();
        }
        Optional<AppUser> user = appUserRepository.findByPublicId(principal.userId());
        return user.map(u -> favoriteRepository.findStationIdsByUserId(u.getId())).orElse(Set.of());
    }

    private Map<Long, Long> listenerCounts(List<Long> stationIds) {
        if (stationIds.isEmpty()) {
            return Map.of();
        }
        Instant cutoff = Instant.now().minus(Duration.ofMinutes(5));
        return playSessionRepository.countActiveListeners(stationIds, cutoff).stream()
                .collect(Collectors.toMap(
                        PlaySessionRepository.StationListenerCount::getStationId,
                        PlaySessionRepository.StationListenerCount::getListeners));
    }

    private StationSummary toSummary(Station station, Set<Long> favoriteIds, Map<Long, Long> listeners) {
        List<GenreSummary> genres = station.getGenres().stream()
                .map(GenreSummary::from)
                .sorted(Comparator.comparing(GenreSummary::name))
                .toList();

        return new StationSummary(
                station.getPublicId(),
                station.getName(),
                station.getSlug(),
                station.getFrequency(),
                CitySummary.from(station.getCity()),
                genres,
                station.getStreamUrl(),
                station.getStreamFormat(),
                station.getArtworkUrl(),
                station.getArtworkColor(),
                station.getInitials(),
                station.getWebsite(),
                station.getDescription(),
                station.isActive(),
                listeners.get(station.getId()),
                favoriteIds.contains(station.getId())
        );
    }
}
