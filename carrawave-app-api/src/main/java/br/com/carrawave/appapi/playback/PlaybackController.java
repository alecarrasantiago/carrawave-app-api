package br.com.carrawave.appapi.playback;

import br.com.carrawave.appapi.playback.dto.HeartbeatRequest;
import br.com.carrawave.appapi.playback.dto.StartPlaybackRequest;
import br.com.carrawave.appapi.playback.dto.StartPlaybackResponse;
import br.com.carrawave.appapi.playback.dto.StopPlaybackRequest;
import br.com.carrawave.appapi.security.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/playback")
public class PlaybackController {

    private final PlaybackService playbackService;

    public PlaybackController(PlaybackService playbackService) {
        this.playbackService = playbackService;
    }

    @PostMapping("/start")
    public ResponseEntity<StartPlaybackResponse> start(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @Valid @RequestBody StartPlaybackRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(playbackService.start(principal, request));
    }

    @PostMapping("/{sessionId}/heartbeat")
    public ResponseEntity<Void> heartbeat(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable UUID sessionId,
            @Valid @RequestBody HeartbeatRequest request
    ) {
        playbackService.heartbeat(principal, sessionId, request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{sessionId}/stop")
    public ResponseEntity<Void> stop(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable UUID sessionId,
            @Valid @RequestBody StopPlaybackRequest request
    ) {
        playbackService.stop(principal, sessionId, request);
        return ResponseEntity.noContent().build();
    }
}
