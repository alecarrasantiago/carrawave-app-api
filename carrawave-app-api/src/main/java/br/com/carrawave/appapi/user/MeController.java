package br.com.carrawave.appapi.user;

import br.com.carrawave.appapi.catalog.dto.StationSummary;
import br.com.carrawave.appapi.security.AuthenticatedUser;
import br.com.carrawave.appapi.user.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/me")
public class MeController {

    private final MeService meService;

    public MeController(MeService meService) {
        this.meService = meService;
    }

    @GetMapping
    public MeResponse getMe(@AuthenticationPrincipal AuthenticatedUser principal) {
        return meService.getMe(principal);
    }

    @PatchMapping
    public MeResponse updateMe(@AuthenticationPrincipal AuthenticatedUser principal, @Valid @RequestBody UpdateMeRequest request) {
        return meService.updateMe(principal, request);
    }

    @GetMapping("/favorites")
    public List<StationSummary> favorites(@AuthenticationPrincipal AuthenticatedUser principal) {
        return meService.getFavorites(principal);
    }

    @PutMapping("/favorites/{stationId}")
    public ResponseEntity<Void> addFavorite(@AuthenticationPrincipal AuthenticatedUser principal, @PathVariable UUID stationId) {
        meService.addFavorite(principal, stationId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/favorites/{stationId}")
    public ResponseEntity<Void> removeFavorite(@AuthenticationPrincipal AuthenticatedUser principal, @PathVariable UUID stationId) {
        meService.removeFavorite(principal, stationId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/history")
    public List<HistoryItem> history(@AuthenticationPrincipal AuthenticatedUser principal,
                                      @RequestParam(defaultValue = "20") int size) {
        return meService.getHistory(principal, size);
    }

    @GetMapping("/settings")
    public SettingsResponse settings(@AuthenticationPrincipal AuthenticatedUser principal) {
        return meService.getSettings(principal);
    }

    @PutMapping("/settings")
    public SettingsResponse updateSettings(@AuthenticationPrincipal AuthenticatedUser principal,
                                            @Valid @RequestBody UpdateSettingsRequest request) {
        return meService.updateSettings(principal, request);
    }
}
