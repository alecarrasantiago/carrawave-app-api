package br.com.carrawave.appapi.catalog;

import br.com.carrawave.appapi.catalog.dto.*;
import br.com.carrawave.appapi.security.AuthenticatedUser;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class StationController {

    private final StationService stationService;
    private final NowPlayingService nowPlayingService;

    public StationController(StationService stationService, NowPlayingService nowPlayingService) {
        this.stationService = stationService;
        this.nowPlayingService = nowPlayingService;
    }

    @GetMapping("/stations")
    public PageResponse<StationSummary> list(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Boolean onlyLive,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal AuthenticatedUser principal
    ) {
        // Montamos o Pageable manualmente (sem sort aqui) porque o resolvedor
        // automático do Spring também escuta o parâmetro "sort" da URL e
        // tentaria interpretar "popular"/"recent" como nome de coluna,
        // colidindo com o nosso "sort" de negócio (popular|name|recent).
        // A ordenação real é resolvida dentro de StationService.search().
        Pageable pageable = PageRequest.of(page, size);
        return stationService.search(city, state, genre, q, onlyLive, sort, pageable, principal);
    }

    @GetMapping("/stations/{id}")
    public StationDetail detail(@PathVariable UUID id, @AuthenticationPrincipal AuthenticatedUser principal) {
        return stationService.getDetail(id, principal);
    }

    @GetMapping("/stations/{id}/stream-token")
    public Map<String, Object> streamToken(@PathVariable UUID id) {
        return stationService.getStreamToken(id);
    }

    @GetMapping("/stations/{id}/now-playing")
    public Map<String, Object> nowPlaying(@PathVariable UUID id) {
        // Lê o metadado "StreamTitle" embutido no stream (protocolo ICY) —
        // best-effort: nem toda rádio manda essa informação, então "title"
        // pode vir null (o app simplesmente não mostra a música nesse caso).
        // Usamos singletonMap (não Map.of) porque Map.of lança NPE em valor nulo.
        return java.util.Collections.singletonMap("title", nowPlayingService.getNowPlaying(id));
    }

    @GetMapping("/home")
    public HomeResponse home(@AuthenticationPrincipal AuthenticatedUser principal) {
        return stationService.home(principal);
    }

    @GetMapping("/cities")
    public List<CitySummary> cities() {
        return stationService.cities();
    }

    @GetMapping("/genres")
    public List<GenreSummary> genres() {
        return stationService.genres();
    }

    @GetMapping("/search")
    public SearchResponse search(@RequestParam String q, @AuthenticationPrincipal AuthenticatedUser principal) {
        return stationService.searchAll(q, principal);
    }
}
