package br.com.carrawave.appapi.playback.dto;

import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

public record StartPlaybackRequest(
        @NotNull UUID stationId,
        String clientSessionId,
        @NotNull Instant startedAt,
        String source
) {
}
