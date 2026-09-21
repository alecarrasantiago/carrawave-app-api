package br.com.carrawave.appapi.catalog;

import br.com.carrawave.appapi.catalog.dto.*;
import br.com.carrawave.appapi.security.AuthenticatedUser;
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

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @GetMapping("/stations")
    public PageResponse<StationSummary> list(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Boolean onlyLive,
            @RequestParam(required = false) String sort,
            Pageable pageable,
            @AuthenticationPrincipal AuthenticatedUser principal
    ) {
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
